import type { TFunction } from "i18next";

type InterpolationMap = {
  welcome: { name: string };
};

export type TypedT = <K>(
  key: K,
  options?: K extends keyof InterpolationMap ? InterpolationMap[K] : undefined,
) => string;

export const createTypedT = (t: TFunction): TypedT => {
  return ((key: string, options?: any) => t(key, options)) as TypedT;
};
