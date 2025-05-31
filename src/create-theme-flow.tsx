import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from 'react';
import { createThemeFactory } from './create-theme';
import type { NestedObject, RNStyle, ValueOrFactory } from './types';
import { getFactoryValue, isFactory } from './utils/getFactoryValue';
import { stringifyCompare } from './utils/stringifyCompare';

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
        type MemoizedStyles = { [key in keyof O]: RNStyle | null };
        // eslint-disable-next-line
        const memoizedStyles = useRef<MemoizedStyles>(
          Object.keys(namedStyles).reduce(
            (acc, cur) => ({ ...acc, [cur]: null }),
            {} as MemoizedStyles
          )
        );
        const checkMemoizedStyle = (key: keyof O, style: RNStyle) => {
          const memoizedStyle = memoizedStyles.current[key];
          const notChanged = stringifyCompare(memoizedStyle, style);
          if (notChanged) {
            return memoizedStyle;
          }

          memoizedStyles.current[key] = style;
          return style;
        };

        // eslint-disable-next-line
        const currentTheme = useTheme();
        const namedStylesWithTheme = getFactoryValue(namedStyles, currentTheme);
        const styleNames = Object.keys(namedStylesWithTheme);

        const styles = styleNames.reduce(
          (acc, cur) => {
            const style = namedStylesWithTheme[cur] ?? {};

            if (isFactory(style)) {
              const getStyle = (params: any) => {
                const styleValue = style(params);

                return checkMemoizedStyle(cur, styleValue);
              };

              return { ...acc, [cur]: getStyle };
            }

            return { ...acc, [cur]: checkMemoizedStyle(cur, style) };
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
