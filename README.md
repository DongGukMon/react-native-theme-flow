# react-native-theme-flow

A powerful and type-safe theming solution for React Native applications. This library provides a flexible way to create and manage themes with dynamic style support.

## Features

- 🎨 Type-safe theme creation and usage
- 🔄 Dynamic style support with theme context
- ⚡️ Performance optimized with style caching
- 📦 Zero dependencies
- 🎯 Full TypeScript support

## Installation

```sh
npm install react-native-theme-flow
# or
yarn add react-native-theme-flow
```

## Quick Start

```tsx
import { createThemeFlow } from 'react-native-theme-flow';

// Define your theme contract
type ThemeContract = {
  colors: {
    primary: string;
    background: string;
  };
  spacing: {
    small: number;
    medium: number;
  };
};

// Create theme flow instance
const { ThemeProvider, useTheme, ThemeFlow, themeFactory } =
  createThemeFlow<ThemeContract>();

// Create your theme
const theme = themeFactory({
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
  },
  spacing: {
    small: 8,
    medium: 16,
  },
});

// Create styles with theme support
const themeFlow = ThemeFlow.create(({theme})=>{
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
  },
  // dynamic styles
  text: ({isPrimary}:{isPrimary:boolean})=> ({
      fontWeight: isPrimary ? '700'|'400'
  })
});

// Use in your component
function MyComponent() {
  const styles = themeFlow.use();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text({isPrimary:true})}>Primary Button</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text({isPrimary:false})}>Secondary Button</Text>
      </TouchableOpacity>
    </View>
  );
}

// Wrap your app with ThemeProvider
function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
}
```

## API Reference

### `createThemeFlow<ThemeContract>()`

Creates a new theme flow instance with the following utilities:

- `ThemeProvider`: Context provider component for theme
- `useTheme`: Hook to access the current theme
- `ThemeFlow`: Object for creating themed styles
- `themeFactory`: Function to create type-safe themes

### `ThemeFlow.create(namedStyles)`

Creates themed styles with support for both static and dynamic styles:

- Static styles: Regular React Native styles
- Dynamic styles: Functions that receive parameters and return React Native Styles

Note: staticStyles returns the cached data and therefore keeps the same reference as long as nothing changes, whereas dynamicStyles produces a new reference on every render.

### `useTheme()`

Hook to access the current theme context.

## License

MIT

---

## More Details

For more detailed usage, refer to the examples included in the repository.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
