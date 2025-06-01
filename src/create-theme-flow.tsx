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
      namedStyles: ValueOrFactory<O, { theme: Theme }>
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
        const namedStylesWithTheme = getFactoryValue(namedStyles, {
          theme: currentTheme,
        });
        const styleNames = Object.keys(namedStylesWithTheme);

        const styles = styleNames.reduce(
          (acc, cur) => {
            const style = namedStylesWithTheme[cur] ?? {};

            /**
             * function 형태인 경우, params에 따라 style이 달라지고,
             * hook처럼 호출 순서로 맵핑하는 방식이 아닌 이상 변경사항 추적에 어려움이 있기 때문에
             * 참조값 유지 로직을 적용하지 않음
             */
            if (isFactory(style)) {
              return { ...acc, [cur]: style };
            }

            /**
             * TODO. stringifyCompare를 사용하지 않고
             * theme의 변경사항만 추적해서 StyleSheet.create 결과물을 반환하는 방향으로 전향
             * Stylesheet.create는 내부적으로 id값으로 캐싱하여 관리하기 때문에 native 데이터 전달에 효율이 좋음
             */
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
