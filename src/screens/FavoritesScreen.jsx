import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useContext, useEffect } from "react";
import { PokemonContext } from "../providers/PokemonContext";
import { FlatList } from "react-native-gesture-handler";
import PokeCard from "../components/PokeCard";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoritesScreen = () => {
  const { favoriteArray, loadFavoritePokemon, favoritePokemon, loading } =
    useContext(PokemonContext);

  useEffect(() => {
    loadFavoritePokemon();
  }, [favoriteArray]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>Favorites</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4264a8" />
            <Text>Carregando favoritos</Text>
          </View>
        ) : favoritePokemon.length > 0 ? (
          <FlatList
            data={favoritePokemon}
            keyExtractor={(item) => item.url.slice(34, -1)}
            renderItem={({ item }) => <PokeCard item={item} />}
          />
        ) : (
          <Text>You haven't added any favorites yet!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FavoritesScreen;
