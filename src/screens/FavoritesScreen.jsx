import { View } from "react-native"
import { Text } from "react-native-paper"
import { useContext, useEffect } from "react"
import { PokemonContext } from "../providers/PokemonContext"
import { FlatList } from "react-native-gesture-handler"
import PokeCard from "../components/PokeCard"


const FavoritesScreen = () => {
    
    const {favoriteArray, loadFavoritePokemon, favoritePokemon, loading} = useContext(PokemonContext);
    
    useEffect(() => {
        loadFavoritePokemon();
    }, [favoriteArray]); // Reload when favoriteArray changes
    
    return(
        <View style={{flex: 1, padding: 10}}>
            <Text style={{fontSize: 24, marginBottom: 10}}>Favorites</Text>
            
            {loading ? (
                <Text>Loading your favorite Pokémon...</Text>
            ) : favoritePokemon.length > 0 ? (
                <FlatList
                    data={favoritePokemon}
                    keyExtractor={(item) => item.url.slice(34, -1)}
                    renderItem={({item}) => <PokeCard item={item} />}
                />
            ) : (
                <Text>You haven't added any favorites yet!</Text>
            )}
        </View>
    )
}

export default FavoritesScreen
