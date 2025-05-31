import { createContext, useContext, type PropsWithChildren } from 'react';
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
    create: <T extends Record<string, any>>(
      namedStyles: ValueOrFactory<
        Record<keyof T, ValueOrFactory<RNStyle, Theme>>,
        Theme
      >
    ) => ({
      use: () => {
        // eslint-disable-next-line
        const currentTheme = useTheme();
        const namedStylesWithTheme = getFactoryValue(namedStyles, currentTheme);
        const styleNames = Object.keys(namedStylesWithTheme);

        const styles = styleNames.reduce(
          (acc, cur) => {
            const style = getFactoryValue(
              namedStylesWithTheme[cur],
              currentTheme
            );
            return { ...acc, [cur]: style };
          },
          {} as { [P in keyof T]: RNStyle }
        );

        return styles;
      },
    }),
  };

  return { ThemeProvider, useTheme, ThemeFlow };
};
