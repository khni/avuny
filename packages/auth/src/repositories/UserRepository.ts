import { IUserRepository } from "@khni/auth";
import { prisma } from "@repo/db";

import { UserCreateInput, UserType } from "./types.js";

/**
 * Repository for handling user data operations
 * @implements {IUserRepository<UserType, UserCreateInput>}
 * @public
 */
export class UserRepository
  implements IUserRepository<UserType, UserCreateInput>
{
  /**
   * Creates a new user with profile and identifier records
   * @param userData - The user creation data
   * @param userData.name - User's display name
   * @param userData.identifier - User's email or phone identifier
   * @param userData.identifierType - Type of identifier (email/phone)
   * @param userData.password - User's hashed password
   * @returns Promise resolving to the created user object
   * @throws {Error} When database operation fails
   * @example
   * ```typescript
   * const user = await userRepository.create({
   *   name: "John Doe",
   *   identifier: "john@example.com",
   *   identifierType: "email",
   *   password: "hashedPassword123"
   * });
   * ```
   */
  public async create({
    name,
    identifier,
    identifierType,
    password,
  }: UserCreateInput): Promise<UserType> {
    try {
      const user = await prisma.user.create({
        data: {
          password,
          profile: {
            create: {
              name,
            },
          },
          identifiers: {
            create: { value: identifier, type: identifierType },
          },
        },
      });

      return {
        ...user,
        name,
        password,
        identifier,
        identifierType,
      };
    } catch (error) {
      throw new Error(
        `Database Error while creating new user with identifier: ${identifier}`,
        { cause: error }
      );
    }
  }

  /**
   * Finds a user by their email or phone identifier
   * @param params - Search parameters
   * @param params.identifier - The email or phone number to search for
   * @returns Promise resolving to user object or null if not found
   * @throws {Error} When database operation fails
   * @example
   * ```typescript
   * const user = await userRepository.findByIdentifier({
   *   identifier: "john@example.com"
   * });
   * ```
   */
  public async findByIdentifier({
    identifier,
  }: {
    identifier: string;
  }): Promise<UserType | null> {
    try {
      const result = await prisma.userIdentifier.findFirst({
        where: { value: identifier },
        include: {
          user: {
            include: {
              profile: true,
              identifiers: true,
            },
          },
        },
      });

      if (!result?.user) {
        return null;
      }

      const { user, value, type } = result;
      const { id, password, profile } = user;

      return {
        id,
        name: profile?.name ?? "",
        password: password ?? "",
        identifier: value,
        identifierType: type as "email" | "phone",
      };
    } catch (error) {
      throw new Error(
        `Database Error while finding user with identifier: ${identifier}`,
        { cause: error }
      );
    }
  }

  /**
   * Finds a user by their unique identifier
   * @param params - Search parameters
   * @param params.id - The user's unique ID
   * @returns Promise resolving to user object or null if not found
   * @throws {Error} When database operation fails
   * @example
   * ```typescript
   * const user = await userRepository.findById({
   *   id: "user-123"
   * });
   * ```
   */
  public async findById({ id }: { id: string }): Promise<UserType | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          identifiers: true,
        },
      });

      if (!user) {
        return null;
      }

      const primaryIdentifier = user.identifiers[0];

      return {
        id: user.id,
        name: user.profile?.name ?? "",
        identifier: primaryIdentifier?.value ?? "",
        identifierType: primaryIdentifier?.type as "email" | "phone",
        password: user.password!,
      };
    } catch (error) {
      throw new Error(`Database Error while finding user with ID: ${id}`, {
        cause: error,
      });
    }
  }

  /**
   * Updates a user's information
   * @param params - Update parameters
   * @param params.identifier - The user's identifier to find the record
   * @param params.data - Partial user data to update
   * @returns Promise resolving to the updated user object
   * @throws {Error} When user not found or database operation fails
   * @example
   * ```typescript
   * const updatedUser = await userRepository.update({
   *   identifier: "john@example.com",
   *   data: { password: "newHashedPassword" }
   * });
   * ```
   */
  public async update({
    identifier,
    data,
  }: {
    identifier: string;
    data: Partial<UserType>;
  }): Promise<UserType> {
    try {
      const existingUser = await this.findByIdentifier({ identifier });

      if (!existingUser) {
        throw new Error(
          `Update failed: user does not exist with identifier ${identifier}`
        );
      }

      const user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          password: data.password,
        },
      });

      return {
        ...existingUser,
        password: data.password!,
      };
    } catch (error) {
      throw new Error(
        `Database Error while updating user with identifier: ${identifier}`,
        { cause: error }
      );
    }
  }
}
