import type { NestedObject } from './types';

export const createThemeFactory = <T extends NestedObject>() => {
  return (theme: T): T => ({ ...theme });
};
