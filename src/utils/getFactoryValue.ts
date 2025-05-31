import type { ValueOrFactory } from '../types';

const isFactory = <T, C>(v: ValueOrFactory<T, C>): v is (input: C) => T => {
  return typeof v === 'function';
};

export const getFactoryValue = <T, C>(
  value: ValueOrFactory<T, C>,
  input: C
): T => {
  return isFactory(value) ? value(input) : value;
};
