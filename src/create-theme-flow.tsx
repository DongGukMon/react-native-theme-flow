import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from 'react';
import { StyleSheet } from 'react-native';
import { createThemeFactory } from './create-theme';
import type { NestedObject, RNStyle, ValueOrFactory, WithId } from './types';
import { getFactoryValue, isFactory } from './utils/get-factory-value';

export const createThemeFlow = <ThemeContract extends NestedObject>() => {
  type Theme = WithId<ThemeContract>;
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
      namedStyles: ValueOrFactory<O, { theme: Theme }>
    ) => ({
      use: () => {
        // eslint-disable-next-line
        const cachedStaticStyles = useRef<{
          styles: RNStyle;
          id: string;
        } | null>(null);

        // eslint-disable-next-line
        const currentTheme = useTheme();
        const namedStylesWithTheme = getFactoryValue(namedStyles, {
          theme: currentTheme,
        });
        const styleNames = Object.keys(namedStylesWithTheme);

        const { dynamicStyles, staticStyles } = styleNames.reduce(
          (acc, cur) => {
            const style = namedStylesWithTheme[cur] ?? {};
            if (isFactory(style)) {
              return {
                ...acc,
                dynamicStyles: {
                  ...acc.dynamicStyles,
                  [cur]: style,
                },
              };
            }
            return {
              ...acc,
              staticStyles: {
                ...acc.staticStyles,
                [cur]: style,
              },
            };
          },
          {
            dynamicStyles: {},
            staticStyles: {},
          } as any
        );

        if (currentTheme.id !== cachedStaticStyles.current?.id) {
          cachedStaticStyles.current = {
            styles: StyleSheet.create(staticStyles),
            id: currentTheme.id,
          };
        }

        return {
          ...dynamicStyles,
          ...cachedStaticStyles.current?.styles,
        } as {
          [K in keyof O]: O[K] extends (input: infer P) => RNStyle
            ? (input: P) => RNStyle
            : RNStyle;
        };
      },
    }),
  };

  const themeFactory = createThemeFactory<ThemeContract>();

  return { ThemeProvider, useTheme, ThemeFlow, themeFactory };
};
