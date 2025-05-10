import { View } from "react-native"
import { Text } from "react-native-paper"
import { useContext } from "react"
import { PokemonContext } from "../providers/PokemonContext"
import { FlatList } from "react-native-gesture-handler"
import PokeCard from "../components/PokeCard"

const FavoritesScreen = () => {
    const {favoriteArray} = useContext(PokemonContext);
    return(
        <View>
            <Text>Favorites</Text>
            <FlatList
            data={favoriteArray}
            renderItem={({item}) => {
                return(
                    <PokeCard item={item}/>
                )
            }}
            />
        </View>
    )
}

export default FavoritesScreen
