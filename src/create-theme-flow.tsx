import { createContext, useContext, type PropsWithChildren } from 'react';
import { createThemeFactory } from './create-theme';
import type { NestedObject, RNStyle, ValueOrFactory } from './types';
import { getFactoryValue } from './utils/getFactoryValue';

export const createThemeFlow = <Theme extends NestedObject>() => {
  const ThemeContext = createContext<Theme | null>(null);

  const useTheme = () => useContext(ThemeContext)!;

  const ThemeProvider = ({
    children,
    theme,
  }: PropsWithChildren<{ theme: Theme }>) => {
    return (
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
  };

  const ThemeFlow = {
    create: <O extends Record<string, ValueOrFactory<RNStyle, any>>>(
      namedStyles: ValueOrFactory<O, Theme>
    ) => ({
      use: () => {
        // eslint-disable-next-line
        const currentTheme = useTheme();
        const namedStylesWithTheme = getFactoryValue(namedStyles, currentTheme);
        const styleNames = Object.keys(namedStylesWithTheme);

        const styles = styleNames.reduce(
          (acc, cur) => {
            const style = namedStylesWithTheme[cur];

            return { ...acc, [cur]: style };
          },
          {} as {
            [K in keyof O]: O[K] extends (input: infer P) => RNStyle
              ? (input: P) => RNStyle
              : RNStyle;
          }
        );

        return styles;
      },
    }),
  };

  const themeFactory = createThemeFactory<Theme>();

  return { ThemeProvider, useTheme, ThemeFlow, themeFactory };
};
