import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import PaginationButton from "../components/PaginationButton";
import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../components/ItemCard";
import { useContext } from "react";
import { FavoritesContext } from "../providers/FavoritesContext";
import { Searchbar } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeContext";

const ItemsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [itemsDatabase, setItemsDatabase] = useState([]);
  const [searchItemText, setSearchItemText] = useState("");
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState("");
  const {
    favoriteItemIds,
    loadFavoriteItems,
    addItemToFavorites,
    removeItemFromFavorites,
  } = useContext(FavoritesContext);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };
  const loadAllItems = async () => {
    const response = await fetch(
      "https://pokeapi.co/api/v2/item?limit=100000&offset=0"
    );
    const data = await response.json();
    setItemsDatabase(data.results);
  };

  useEffect(() => {
    loadItems();
    loadAllItems();
  }, []);

  const loadItems = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/item");
    const data = await response.json();
    setItems(data.results);
    setNext(data.next);
    setPrevious(data.previous);
  };

  const searchItems = (searchItemText) => {
    setSearchItemText(searchItemText);
    const filteredItems = itemsDatabase.filter((item) => {
      return (
        item.name.includes(searchItemText.toLowerCase()) ||
        item.url.slice(34, -1) === searchItemText
      );
    });
    setItems(filteredItems);
  };

  const handleNext = async () => {
    const response = await fetch(next);
    const data = await response.json();
    setItems(data.results);
    setNext(data.next);
    setPrevious(data.previous);
  };

  const handlePrevious = async () => {
    const response = await fetch(previous);
    const data = await response.json();
    setItems(data.results);
    setNext(data.next);
    setPrevious(data.previous);
  };

  useEffect(() => {
    loadFavoriteItems();
  }, [favoriteItemIds]);

  return (
    <GestureRecognizer
      onSwipeLeft={handleNext}
      onSwipeRight={handlePrevious}
      config={swipeConfig}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["bottom", "left", "right"]}
      >
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Searchbar
            placeholder="Search Items"
            onChangeText={searchItems}
            value={searchItemText}
            style={styles.searchBar}
          />
        </View>
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const id = item.url.split("/").filter(Boolean).pop();
            return (
              <ItemCard
                item={item}
                id={id}
                favoriteItems={favoriteItemIds}
                addItemToFavorites={addItemToFavorites}
                removeItemFromFavorites={removeItemFromFavorites}
                theme={theme}
              />
            );
          }}
        />
        <View style={styles.buttonContainer}>
          {previous && (
            <PaginationButton action={handlePrevious} icon={"chevron-left"} />
          )}
          {next && (
            <PaginationButton action={handleNext} icon={"chevron-right"} />
          )}
        </View>
      </SafeAreaView>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  list: {
    marginBottom: 5,
  },
});

export default ItemsScreen;
