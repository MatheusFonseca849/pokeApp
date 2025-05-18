import { View, Text, StyleSheet, Image } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ItemCard = ({ item, favoriteItems }) => {

  const navigation = useNavigation();

  const itemId = item.url.slice(
    item.url.lastIndexOf("item/") + 5,
    item.url.length - 1
  );
  const itemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;

  return (
    <Card style={styles.card} onPress={() => navigation.navigate('ItemDetails', {item})}>
      <Text style={styles.title}>{itemId}</Text>
      <View style={styles.cardContainer}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: itemUrl }} style={{ width: 64, height: 64 }} />
          <Text>{item.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            icon={favoriteItems.includes(itemId) ? "heart" : "heart-outline"}
            style={styles.favButton}
           
          ></IconButton>
        </View>
      </View>
    </Card>
  );
};

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
  },
});

export default ItemCard;
