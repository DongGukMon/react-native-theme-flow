import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createThemeFactory, createThemeFlow } from 'react-native-theme-flow';

interface ThemeContract {
  colors: {
    primary: string;
    secondary: string;
  };
}

const themeFactory = createThemeFactory<ThemeContract>();

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

const { ThemeProvider, useTheme, ThemeFlow } = createThemeFlow<ThemeContract>();

const Switch = ({ switchTheme }: { switchTheme: () => void }) => {
  const styles = s.use();
  const theme = useTheme();
  console.log(theme);

  return (
    <TouchableOpacity onPress={switchTheme} style={styles.container}>
      <Text style={styles.text({ isSelected: false })}>Switch</Text>
      <Text style={styles.text({ isSelected: true })}>Switch</Text>
    </TouchableOpacity>
  );
};

const s = ThemeFlow.create((theme) => ({
  container: {
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
}));

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const switchTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <View style={styles.container}>
        <Switch switchTheme={switchTheme} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
