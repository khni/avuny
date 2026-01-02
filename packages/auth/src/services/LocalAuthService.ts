import { User } from "@avuny/db/types";

interface IUserRepository<User> {
  findByIdentifier(identifier: string): Promise<User | null>;
}
export class LocalAuthService {
  constructor(private userRepository: IUserRepository<User>) {}
  register = async (
    identifier: string,
    password: string,
    name: string,
    identifierType: string
  ) => {
    const _user = await this.userRepository.findByIdentifier(identifier);
    if (_user) {
      throw new Error(`${identifierType} is already exist`, {
        cause: identifier,
      });
    }
  };
}
