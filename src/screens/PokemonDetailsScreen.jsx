import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  ActivityIndicator,
  Card,
  Button,
  useTheme,
} from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PokemonDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sprites, setSprites] = useState({});
  const [currentSprite, setCurrentSprite] = useState("");

  const { colors } = useTheme();

  const navigation = useNavigation();

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };

  const goToPreviousPokemon = () => {
    if (parseInt(id) > 1) {
      // Navigate to the previous Pokémon
      const previousId = (parseInt(id) - 1).toString();
      // Update the route params without leaving the screen
      navigation.setParams({ id: previousId });
    }
  };

  const goToNextPokemon = () => {
    if (parseInt(id) < 151) {
      // Navigate to the next Pokémon
      const nextId = (parseInt(id) + 1).toString();
      // Update the route params without leaving the screen
      navigation.setParams({ id: nextId });
    }
  };

  const handleSpriteChange = (direction) => {
    // Get all valid sprite URLs
    const spriteUrls = Object.entries(sprites)
      .filter(([key, value]) => typeof value === "string" && value)
      .map(([key, value]) => value);

    // Find current index
    const currentIndex = spriteUrls.indexOf(currentSprite);

    // Navigate based on direction
    if (direction === "left" && currentIndex > 0) {
      setCurrentSprite(spriteUrls[currentIndex - 1]);
    } else if (direction === "right" && currentIndex < spriteUrls.length - 1) {
      setCurrentSprite(spriteUrls[currentIndex + 1]);
    }

    console.log("Current sprite URL:", currentSprite);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => {
        setPokemon(response.data);
        setSprites(response.data.sprites);
        setCurrentSprite(response.data.sprites.front_default);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4264a8" />
        <Text>Loading Pokémon details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <GestureRecognizer
      onSwipeLeft={goToNextPokemon}
      onSwipeRight={goToPreviousPokemon}
      config={swipeConfig}
      style={styles.flexContainer}
    >
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>{pokemon?.name}</Text>

          <View style={styles.imageContainer}>
            <Button
              icon="arrow-left"
              onPress={() => handleSpriteChange("left")}
            />
            <Image source={{ uri: currentSprite }} style={styles.image} />
            <Button
              icon="arrow-right"
              onPress={() => handleSpriteChange("right")}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Types</Text>
            <View style={styles.typesContainer}>
              {pokemon?.types.map((typeInfo) => {
                const typeName = typeInfo.type.name;
                const backgroundColor = colors[typeName] || colors.surface; // fallback if type isn't defined

                return (
                  <Text
                    key={typeName}
                    style={[styles.type, { backgroundColor }]}
                  >
                    {typeName}
                  </Text>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Stats</Text>
            {pokemon?.stats.map((stat) => (
              <View key={stat.stat.name} style={styles.statRow}>
                <Text style={styles.statName}>{stat.stat.name}:</Text>
                <Text style={styles.statValue}>{stat.base_stat}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Abilities</Text>
            {pokemon?.abilities.map((ability) => (
              <Text key={ability.ability.name} style={styles.ability}>
                {ability.ability.name}
              </Text>
            ))}
          </View>
        <View style={styles.navigationButtons}>
          <Button
            icon="chevron-left"
            mode="contained"
            onPress={goToPreviousPokemon}
            disabled={parseInt(id) <= 1}
          >
            Previous
          </Button>

          <Button
            icon="chevron-right"
            mode="contained"
            onPress={goToNextPokemon}
            disabled={parseInt(id) >= 151}
            iconPosition="right"
          >
            Next
          </Button>
        </View>
        </Card>
      </ScrollView>
    </GestureRecognizer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    marginTop: -40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    marginBottom: 8,
    
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  type: {
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  statName: {
    textTransform: "capitalize",
  },
  statValue: {
    fontWeight: "bold",
  },
  ability: {
    textTransform: "capitalize",
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});

export default PokemonDetailsScreen;
