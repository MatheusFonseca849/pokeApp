import { View, Text, StyleSheet, Image } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ItemCard = ({
  item,
  favoriteItems,
  addItemToFavorites,
  removeItemFromFavorites,
  theme,
}) => {
  const navigation = useNavigation();

  const itemId = item.url.slice(
    item.url.lastIndexOf("item/") + 5,
    item.url.length - 1
  );
  const itemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate("ItemDetails", { id: itemId })}
    >
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {itemId}
      </Text>
      <View style={styles.cardContainer}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: itemUrl }} style={{ width: 64, height: 64 }} />
          <Text style={{ color: theme.colors.onSurface }}>{item.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            icon={favoriteItems.includes(itemId) ? "heart" : "heart-outline"}
            style={styles.favButton}
            onPress={() => {
              favoriteItems.includes(itemId)
                ? removeItemFromFavorites(itemId)
                : addItemToFavorites(itemId);
            }}
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
