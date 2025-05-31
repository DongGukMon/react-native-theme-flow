import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type NestedObject = {
  [key: string | symbol]: any | NestedObject;
};

export type ValueOrFactory<T, C> = T | ((input: C) => T);

export type RNStyle = ViewStyle | TextStyle | ImageStyle;
