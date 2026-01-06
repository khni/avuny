export type Ok<T> = {
  success: true;
  data: T;
};

export type Fail<E = string> = {
  success: false;
  error: E;
};

export type Result<T, E = string> = Ok<T> | Fail<E>;

/**
 * Result constructors
 * Prevents boolean widening and enforces correctness
 */
export const ok = <T>(data: T): Ok<T> => ({
  success: true,
  data,
});

export const fail = <E>(error: E): Fail<E> => ({
  success: false,
  error,
});
