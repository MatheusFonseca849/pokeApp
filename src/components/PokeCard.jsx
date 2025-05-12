import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { Image } from "react-native";
import { Button } from "react-native-paper";
import { useContext } from "react";
import { PokemonContext } from "../providers/PokemonContext";
import { useNavigation } from "@react-navigation/native";

const PokeCard = ({item}) => {

    const navigation = useNavigation();

    const {addToFavorites, removeFromFavorites, favoriteArray} = useContext(PokemonContext);

    const pokeId = item.url.slice(34, -1);
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
    return(
        <Card style={styles.card} onPress={() => navigation.navigate('PokemonDetails', {id: pokeId})}>
        <Text style={styles.title}>{pokeId}</Text>
        <View style={styles.cardContainer}>
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: imgUrl }}
            style={{
              width: 64,
              height: 64,
            }}
          />
          <Text>{item.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <IconButton
            icon={favoriteArray.includes(pokeId) ? "heart" : "heart-outline"}
            style={styles.favButton}
            onPress={() => {
              favoriteArray.includes(pokeId) ? removeFromFavorites(pokeId) : addToFavorites(pokeId)
            }}
            >
            </IconButton>
        </View>
        </View>
      </Card>
    )
}

const styles = StyleSheet.create({
  
  card: {
    display: "flex",
    gap: 5,
    marginBottom: 8,
  },
 
  itemContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },

  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    margin: 5,
  },

  favButton: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  }

});

export default PokeCard