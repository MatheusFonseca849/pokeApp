import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import DrawerRoutes from "./src/navigation/DrawerRoutes";
import PokemonProvider from "./src/providers/PokemonContext";
import FilterProvider from "./src/providers/FilterContext";
import { FavoritesProvider } from "./src/providers/FavoritesContext";
import { ThemeProvider } from "./src/providers/ThemeContext";
import { TeamsProvider } from "./src/providers/TeamsContext";

export default function App() {
  // Create custom navigation themes that combine React Navigation's themes with our Paper theme colors
  const customNavigationTheme = (theme) => {
    const baseTheme = theme.dark ? NavigationDarkTheme : NavigationDefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.onSurface,
        border: theme.colors.outline,
        notification: theme.colors.error,
      },
    };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      {(theme) => (
          <PaperProvider theme={theme}>
            <TeamsProvider>
            <FilterProvider>
              <FavoritesProvider>
                <PokemonProvider>
                  <NavigationContainer theme={customNavigationTheme(theme)}>
                    <DrawerRoutes />
                  </NavigationContainer>
                </PokemonProvider>
              </FavoritesProvider>
            </FilterProvider>
            </TeamsProvider>
          </PaperProvider>
        )}  
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
