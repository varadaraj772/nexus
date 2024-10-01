import React, {createContext, useState} from 'react';
import {MD3LightTheme} from 'react-native-paper';

export const ThemeContext = createContext();

const defaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee', // Default primary color
  },
};

const orangeTheme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(255, 152, 0)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 224, 178)',
    onPrimaryContainer: 'rgb(102, 51, 0)',
    secondary: 'rgb(255, 193, 7)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 236, 179)',
    onSecondaryContainer: 'rgb(130, 100, 0)',
    tertiary: 'rgb(255, 179, 71)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 240, 200)',
    onTertiaryContainer: 'rgb(119, 66, 0)',
    error: 'rgb(211, 47, 47)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 205, 210)',
    onErrorContainer: 'rgb(72, 0, 0)',
    background: 'rgb(255, 248, 240)',
    onBackground: 'rgb(29, 27, 24)',
    surface: 'rgb(255, 248, 240)',
    onSurface: 'rgb(29, 27, 24)',
    surfaceVariant: 'rgb(255, 233, 216)',
    onSurfaceVariant: 'rgb(100, 71, 54)',
    outline: 'rgb(156, 114, 76)',
    outlineVariant: 'rgb(206, 171, 139)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(50, 45, 41)',
    inverseOnSurface: 'rgb(255, 236, 221)',
    inversePrimary: 'rgb(255, 204, 128)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(255, 238, 216)',
      level2: 'rgb(255, 231, 202)',
      level3: 'rgb(255, 224, 188)',
      level4: 'rgb(255, 219, 180)',
      level5: 'rgb(255, 213, 171)',
    },
    surfaceDisabled: 'rgba(29, 27, 24, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 24, 0.38)',
    backdrop: 'rgba(49, 44, 39, 0.4)',
  },
};

const greenTheme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(76, 175, 80)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(200, 230, 201)',
    onPrimaryContainer: 'rgb(0, 77, 26)',
    secondary: 'rgb(139, 195, 74)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(230, 247, 219)',
    onSecondaryContainer: 'rgb(53, 105, 35)',
    tertiary: 'rgb(102, 187, 106)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(204, 242, 204)',
    onTertiaryContainer: 'rgb(30, 77, 40)',
    error: 'rgb(211, 47, 47)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 205, 210)',
    onErrorContainer: 'rgb(72, 0, 0)',
    background: 'rgb(245, 255, 245)',
    onBackground: 'rgb(29, 33, 29)',
    surface: 'rgb(245, 255, 245)',
    onSurface: 'rgb(29, 33, 29)',
    surfaceVariant: 'rgb(224, 242, 230)',
    onSurfaceVariant: 'rgb(67, 81, 72)',
    outline: 'rgb(126, 154, 133)',
    outlineVariant: 'rgb(195, 216, 201)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(45, 52, 46)',
    inverseOnSurface: 'rgb(239, 255, 240)',
    inversePrimary: 'rgb(165, 214, 167)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(233, 246, 233)',
      level2: 'rgb(219, 239, 219)',
      level3: 'rgb(204, 231, 206)',
      level4: 'rgb(195, 226, 197)',
      level5: 'rgb(182, 219, 184)',
    },
    surfaceDisabled: 'rgba(29, 33, 29, 0.12)',
    onSurfaceDisabled: 'rgba(29, 33, 29, 0.38)',
    backdrop: 'rgba(39, 46, 39, 0.4)',
  },
};

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(greenTheme);

  const changeTheme = newTheme => {
    switch (newTheme) {
      case 'Orange':
        setTheme(orangeTheme);
        break;
      case 'Green':
        setTheme(greenTheme);
        break;
      default:
        setTheme(defaultTheme);
        break;
    }
  };

  return (
    <ThemeContext.Provider value={{theme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
