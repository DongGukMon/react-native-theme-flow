import { useReducer, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ThemeButton } from './ThemeButton';
import { ThemeFlow, useThemeFlow } from './theme';

export const ExampleScreen = ({
  switchTheme,
}: {
  switchTheme: (themeName: 'light' | 'dark') => void;
}) => {
  const styles = s.use();
  const { theme } = useThemeFlow();

  const [count, forceRender] = useReducer((prev) => prev + 1, 0);

  const prevContainerStyle = useRef(styles.container);
  if (prevContainerStyle.current !== styles.container) {
    console.log('changed cached styles');
    prevContainerStyle.current = styles.container;
  }

  return (
    <View style={styles.container}>
      <ThemeButton
        selected={theme.name === 'light'}
        type={'light'}
        onPress={() => switchTheme('light')}
      />
      <TouchableOpacity onPress={forceRender} style={styles.counterButton}>
        <Text style={styles.counterButtonText}>Rerender {count}</Text>
      </TouchableOpacity>
      <ThemeButton
        selected={theme.name === 'dark'}
        type={'dark'}
        onPress={() => switchTheme('dark')}
      />
    </View>
  );
};

const s = ThemeFlow.create(
  ({ theme, windowDimensions, insets, userPreferences }) => ({
    container: {
      flex: 1,
      width: windowDimensions.width,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.base,
      gap: 40,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    counterButton: {
      borderRadius: 12,
      padding: 24,
      backgroundColor: theme.colors.counter,
      opacity: userPreferences.animations ? 1 : 0.8,
    },
    counterButtonText: {
      color: theme.colors.base,
      fontWeight: '700',
      fontSize: userPreferences.fontSize,
    },
  })
);
