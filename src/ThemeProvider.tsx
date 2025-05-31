import { createContext, useContext, type PropsWithChildren } from 'react';
import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

type NestedObject = {
  [key: string | symbol]: any | NestedObject;
};

type ValueOrFactory<T, C> = T | ((input: C) => T);

type RNStyle = ViewStyle | TextStyle | ImageStyle;

const getValue = <T, C>(value: ValueOrFactory<T, C>, input: C): T => {
  const isFactory = (v: ValueOrFactory<T, C>): v is (input: C) => T => {
    return typeof v === 'function';
  };
  return isFactory(value) ? value(input) : value;
};

export const createThemeFlow = <Theme extends NestedObject>(theme: Theme) => {
  const ThemeContext = createContext<Theme>(theme);

  const useTheme = () => useContext(ThemeContext);

  const ThemeProvider = ({ children }: PropsWithChildren) => {
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
        const namedStylesWithTheme = getValue(namedStyles, currentTheme);
        const styleNames = Object.keys(namedStylesWithTheme);

        const styles = styleNames.reduce(
          (acc, cur) => {
            const style = getValue(namedStylesWithTheme[cur], currentTheme);
            return { ...acc, [cur]: style };
          },
          {} as { [P in keyof T]: Theme }
        );

        return styles;
      },
    }),
  };

  return { ThemeProvider, useTheme, ThemeFlow };
};
