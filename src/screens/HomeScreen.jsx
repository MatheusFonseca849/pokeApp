import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";

export default function HomeScreen() {
    
  const [pokeList, setPokeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState(null);

  const baseUrl = "https://pokeapi.co/api/v2/";

  const loadPokemon = async () => {
    axios
      .get(`${baseUrl}pokemon`)
      .then((response) => {
        setPokeList(response.data.results);
        setNext(response.data.next);
        response.data.previous && setPrevious(response.data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load Pokémon:", error);
        setLoading(false);
      });
  };

  const handleNext = () => {
    axios
      .get(next)
      .then((response) => {
        setPokeList(response.data.results);
        setNext(response.data.next);
        response.data.previous && setPrevious(response.data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load Pokémon:", error);
        setLoading(false);
      });
  };

  const handlePrevious = () => {
    axios
      .get(previous)
      .then((response) => {
        setPokeList(response.data.results);
        setNext(response.data.next);
        setPrevious(response.data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load Pokémon:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    gestureIsClickThreshold: 5
  };
  
  const onSwipeLeft = () => {
    handleNext();
  };
  
  const onSwipeRight = () => {
    handlePrevious();
  };

  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={swipeConfig}
    >
      <FlatList
        style={styles.list}
        data={pokeList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const pokeId = item.url.slice(34, -1);
          const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;

          return (
            <Card style={styles.card}>
              <Text style={styles.title}>{pokeId}</Text>
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
            </Card>
          );
        }}
      />
      <View style={styles.buttonContainer}>
        {previous && <Button
          mode="contained"
          color="#4264a8"
          onPress={handlePrevious}
          style={styles.button}
        >
          Previous
        </Button>}
        <Button
          mode="contained"
          color="#4264a8"
          onPress={handleNext}
          style={styles.button}
        >
          Next
        </Button>
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 32,
  },
  card: {
    display: "flex",
    gap: 5,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  title: {
    fontSize: 22,
    margin: 5,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 62,
  },
  button: {
    width: 100,
  },
});
