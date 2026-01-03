// lib/result.ts
export type Ok<T> = {
  success: true;
  data: T;
};

export type Fail<E = string> = {
  success: false;
  error: E;
};

export type Result<T, E = string> = Ok<T> | Fail<E>;
