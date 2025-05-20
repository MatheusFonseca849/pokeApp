import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import PaginationButton from "../components/PaginationButton";
import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../components/ItemCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { FavoritesContext } from "../providers/FavoritesContext";

const ItemsScreen = () => {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState("");
  const { favoriteItems, setFavoriteItems, loadFavoriteItems, addItemToFavorites, removeItemFromFavorites } = useContext(FavoritesContext);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/item");
    const data = await response.json();
    setItems(data.results);
    setNext(data.next);
    setPrevious(data.previous);
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
    AsyncStorage.getItem('favoriteItems').then((favorites) => {
        if (favorites) {
            const favoritesList = JSON.parse(favorites)
            setFavoriteItems(favoritesList)
            loadFavoriteItems(favoritesList)
        }
    });
}, []);

  return (
    <GestureRecognizer
      onSwipeLeft={handleNext}
      onSwipeRight={handlePrevious}
      config={swipeConfig}
      style={styles.container}
    >
      <SafeAreaView
        style={styles.container}
        edges={["bottom", "left", "right"]}
      >
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const id = item.url.split("/").filter(Boolean).pop();
          console.log(id)
          return (
          <ItemCard item={item} id={id} favoriteItems={favoriteItems} addItemToFavorites={addItemToFavorites} removeItemFromFavorites={removeItemFromFavorites}/>        
        )
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
    gap: 8,
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
