import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from 'react';
import { type ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import { createThemeFactory } from './create-theme';
import type { NestedObject, RNStyle, ValueOrFactory, WithId } from './types';
import { getFactoryValue, isFactory } from './utils/get-factory-value';

export const createThemeFlow = <
  ThemeContract extends NestedObject,
  ExtraData extends Record<string, any> = any,
>() => {
  type Theme = WithId<ThemeContract>;
  const ThemeContext = createContext<{
    theme: Theme;
    extraData?: ExtraData;
  } | null>(null);

  const useThemeFlow = () => useContext(ThemeContext)!;
  /**
   * @deprecated instead use useThemeFlow
   */
  const useTheme = () => {
    const { theme } = useThemeFlow();
    return theme;
  };

  const ThemeProvider = ({
    children,
    theme,
    extraData,
  }: PropsWithChildren<{ theme: Theme; extraData?: ExtraData }>) => {
    return (
      <ThemeContext.Provider value={{ theme, extraData }}>
        {children}
      </ThemeContext.Provider>
    );
  };

  const ThemeFlow = {
    create: <O extends { [key: string]: ValueOrFactory<RNStyle, any> }>(
      namedStyles: ValueOrFactory<
        O,
        { theme: Theme; windowDimensions: ScaledSize } & ExtraData
      >
    ) => ({
      use: () => {
        // eslint-disable-next-line
        const windowDimensions = useWindowDimensions();
        // eslint-disable-next-line
        const cachedStaticStyles = useRef<{
          styles: RNStyle;
          id: string;
        } | null>(null);

        // eslint-disable-next-line
        const { theme: currentTheme, extraData } = useThemeFlow();
        const namedStylesWithTheme = getFactoryValue(namedStyles, {
          theme: currentTheme,
          windowDimensions,
          ...(extraData || {}),
        } as { theme: Theme; windowDimensions: ScaledSize } & ExtraData);
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

        const cachedId = JSON.stringify(staticStyles);
        if (cachedId !== cachedStaticStyles.current?.id) {
          cachedStaticStyles.current = {
            styles: StyleSheet.create(staticStyles),
            id: cachedId,
          };
        }

        return {
          ...dynamicStyles,
          ...cachedStaticStyles.current?.styles,
        } as {
          [K in keyof O]: O[K] extends (input: infer P) => infer S
            ? (input: P) => S
            : O[K];
        };
      },
    }),
  };

  const themeFactory = createThemeFactory<ThemeContract>();

  return { ThemeProvider, useTheme, useThemeFlow, ThemeFlow, themeFactory };
};
