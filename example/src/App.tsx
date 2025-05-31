import { memo, useReducer, useState } from 'react';
import { Text, TouchableOpacity, View, type TextProps } from 'react-native';
import { createThemeFlow } from 'react-native-theme-flow';

interface ThemeContract {
  colors: {
    primary: string;
    secondary: string;
  };
}

const { ThemeProvider, useTheme, ThemeFlow, themeFactory } =
  createThemeFlow<ThemeContract>();

const lightTheme = themeFactory({
  colors: {
    primary: '#fff111',
    secondary: '#111fff',
  },
});
const darkTheme = themeFactory({
  colors: {
    primary: '#111fff',
    secondary: '#fff111',
  },
});

const MemoizedText = memo((props: TextProps) => {
  return <Text {...props} />;
});

const SwitchBox = ({ switchTheme }: { switchTheme: () => void }) => {
  const styles = s.use();
  const theme = useTheme();
  console.log(theme);

  const [count, forceRender] = useReducer((prev) => prev + 1, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={switchTheme} style={styles.textContainer}>
        <MemoizedText style={styles.text({ isSelected: false })}>
          Switch
        </MemoizedText>
        <MemoizedText style={styles.text({ isSelected: true })}>
          Switch
        </MemoizedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={forceRender} style={styles.renderButton}>
        <MemoizedText style={styles.rerenderText}>
          Rerender {count}
        </MemoizedText>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const switchTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <SwitchBox switchTheme={switchTheme} />
    </ThemeProvider>
  );
}

const s = ThemeFlow.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  textContainer: {
    backgroundColor: theme.colors.secondary,
    gap: 12,
    padding: 12,
    borderRadius: 10,
  },
  text: (params: { isSelected: boolean }) => ({
    color: theme.colors.primary,
    fontWeight: params.isSelected ? '700' : '400',
    fontSize: 27,
  }),
  renderButton: {
    backgroundColor: 'yellow',
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },
  rerenderText: {
    fontSize: 14,
    fontWeight: '700',
  },
}));
