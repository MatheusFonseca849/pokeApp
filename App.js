import 'react-native-reanimated';
import 'react-native-gesture-handler'; // keep this at the very top
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import DrawerRoutes from './src/navigation/DrawerRoutes';
import PokemonProvider from './src/providers/PokemonContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PokemonProvider>
        <PaperProvider>
          <NavigationContainer>
            <DrawerRoutes />
          </NavigationContainer>
        </PaperProvider>
      </PokemonProvider>
    </GestureHandlerRootView>
  );
}