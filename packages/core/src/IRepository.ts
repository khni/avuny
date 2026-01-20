// export type WhereUniqueInput =
//   | { id: string }
//   | { organizationId_name: { name: string; organizationId: string } };
// export interface IBaseRepository<Tx = unknown> {
//   create<TData, ReturnType extends { id: string }>(params: {
//     data: TData;
//     tx?: Tx;
//   }): Promise<ReturnType>;
//   findUnique<TWhereUniqueInput, ReturnType extends { id: string }>(params: {
//     where: TWhereUniqueInput;
//     tx?: Tx;
//   }): Promise<ReturnType | null>;
//   update<TData, ReturnType extends { id: string }>(params: {
//     data: TData;
//     where: { id: string };
//     tx?: Tx;
//   }): Promise<ReturnType>;
//   count<RoleWhereInput>(
//     params?:
//       | {
//           where?: RoleWhereInput | undefined;
//           tx?: Tx;
//         }
//       | undefined,
//   ): Promise<number>;
//   createTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T>;
// }

export interface IBaseRepository<
  Tx = unknown,
  TEntity extends { id: string; name: string } = { id: string; name: string },
  TCreateInput = unknown,
  TWhereUnique = unknown,
  TWhere = unknown,
  TCreateReturnType extends { id: string; name: string } = {
    id: string;
    name: string;
  },
  TCreateUpdateType extends { id: string; name: string } = {
    id: string;
    name: string;
  },
> {
  create(params: { data: TCreateInput; tx?: Tx }): Promise<TCreateReturnType>;

  findUnique(params: { where: TWhereUnique; tx?: Tx }): Promise<TEntity | null>;

  update(params: {
    data: Partial<TCreateInput>;
    where: TWhereUnique;
    tx?: Tx;
  }): Promise<TCreateUpdateType>;

  count(params?: { where?: TWhere; tx?: Tx }): Promise<number>;

  createTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T>;
}
