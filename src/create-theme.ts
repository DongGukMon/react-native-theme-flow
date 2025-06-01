import type { NestedObject, WithId } from './types';
import { getRandomId } from './utils/get-random-id';

export const createThemeFactory = <ThemeContract extends NestedObject>() => {
  return (theme: ThemeContract): WithId<ThemeContract> => ({
    ...theme,
    id: getRandomId(),
  });
};
