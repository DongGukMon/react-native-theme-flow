# react-native-theme-flow

A powerful and type-safe theming solution for React Native applications. This library provides a flexible way to create and manage themes with dynamic style support.

## Features

- 🎨 Type-safe theme creation and usage
- 🔄 Dynamic style support with theme context
- ⚡️ Performance optimized with style caching
- 📦 Zero dependencies
- 🎯 Full TypeScript support
- 🔧 Extra data support for additional context (insets, user preferences, etc.)

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
const { ThemeProvider, useThemeFlow, ThemeFlow, themeFactory } =
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
const themeFlow = ThemeFlow.create(({theme, windowDimensions}) => ({
  container: {
    width:windowDimensions.width,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
  },
  // dynamic styles
  text: ({isPrimary}: {isPrimary: boolean}) => ({
    fontWeight: isPrimary ? '700' : '400'
  })
}));

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

## Advanced Usage

### Using Extra Data

You can pass additional context data through the ThemeProvider and access it in your styles:

```tsx
import { createThemeFlow } from 'react-native-theme-flow';

// Define your theme contract and extra data type
type ThemeContract = {
  colors: {
    primary: string;
    background: string;
  };
};

type ExtraData = {
  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  userPreferences: {
    fontSize: number;
    animations: boolean;
  };
};

// Create theme flow with extra data support
const { ThemeProvider, useThemeFlow, ThemeFlow, themeFactory } =
  createThemeFlow<ThemeContract, ExtraData>();

// Create styles that use both theme and extra data
const styles = ThemeFlow.create(
  ({ theme, windowDimensions, insets, userPreferences }) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    text: {
      fontSize: userPreferences.fontSize,
      color: theme.colors.primary,
    },
  })
);

// Use in your component
function MyComponent() {
  const { theme, insets, userPreferences } = useThemeFlow();
  const componentStyles = styles.use();

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.text}>Hello World</Text>
    </View>
  );
}

// Provide theme and extra data
function App() {
  const extraData = {
    insets: { top: 50, bottom: 30, left: 0, right: 0 },
    userPreferences: { fontSize: 16, animations: true },
  };

  return (
    <ThemeProvider theme={theme} extraData={extraData}>
      <MyComponent />
    </ThemeProvider>
  );
}
```

## API Reference

### `createThemeFlow<ThemeContract, ExtraData?>()`

Creates a new theme flow instance with the following utilities:

- `ThemeProvider`: Context provider component for theme and extra data
- `useTheme`: Hook to access the current theme (deprecated, use `useThemeFlow`)
- `useThemeFlow`: Hook to access theme and extra data
- `ThemeFlow`: Object for creating themed styles
- `themeFactory`: Function to create type-safe themes

**Parameters:**
- `ThemeContract`: Type definition for your theme structure
- `ExtraData` (optional): Type definition for additional context data

### `ThemeProvider`

Context provider component that makes theme and extra data available to child components.

**Props:**
- `theme`: Theme object created with `themeFactory`
- `extraData` (optional): Additional context data
- `children`: React children

### `ThemeFlow.create(namedStyles)`

Creates themed styles with support for both static and dynamic styles.

**Parameters:**
- `namedStyles`: Object or function returning an object with style definitions

The function receives an object with:
- `theme`: Current theme object
- `windowDimensions`: Current window dimensions from `useWindowDimensions`
- `...extraData`: Spread of extra data properties (if provided)

**Returns:**
- Object with `use()` method that returns the processed styles

**Style Types:**
- Static styles: Regular React Native styles
- Dynamic styles: Functions that receive parameters and return React Native styles

Note: Static styles are cached and maintain the same reference until the theme or extra data changes, while dynamic styles create new references on each render.

### `useThemeFlow()`

Hook to access the current theme context and extra data.

**Returns:**
- Object with `theme` and extra data properties

### `useTheme()` (Deprecated)

Hook to access only the current theme context. Use `useThemeFlow()` instead for full functionality.

## License

MIT

---

## More Details

For more detailed usage, refer to the examples included in the repository.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
