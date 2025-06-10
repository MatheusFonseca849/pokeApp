import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { TeamsContext } from "../providers/TeamsContext";
import { RadarChart } from "@salmonco/react-native-radar-chart";

import {
  Text,
  ActivityIndicator,
  Card,
  Button,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { PokemonContext } from "../providers/PokemonContext";
import AddToTeamModal from "../components/AddToTeamModal";

const PokemonDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sprites, setSprites] = useState({});
  const [currentSprite, setCurrentSprite] = useState("");
  const { addToFavorites, removeFromFavorites, favoriteArray } =
    useContext(PokemonContext);

  const { teams, setModalReopenData } = useContext(TeamsContext);

  const [teamModalVisible, setTeamModalVisible] = useState(false);

  const { colors } = useTheme();

  const navigation = useNavigation();

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (route.params?.returnToModal) {
        // Set data to reopen modal when returning
        setModalReopenData({
          teamId: route.params.teamId,
          teamColor: route.params.teamColor
        });
      }
    });
  
    return unsubscribe;
  }, [navigation]);

  const goToPreviousPokemon = () => {
    if (parseInt(id) > 1) {
      // Navigate to the previous Pokémon
      const previousId = (parseInt(id) - 1).toString();
      // Update the route params without leaving the screen
      navigation.setParams({ id: previousId });
    }
  };

  const goToNextPokemon = () => {
    if (parseInt(id) < 1000000) {
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
            <View style={styles.headerContainer}>
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.title}>
                #{pokemon?.id} {pokemon?.name}
              </Text>
              <View style={styles.favButtonContainer}>
                <IconButton
                  icon={
                    favoriteArray.includes(pokemon.id.toString())
                      ? "heart"
                      : "heart-outline"
                  }
                  style={styles.favButton}
                  onPress={() => {
                    favoriteArray.includes(pokemon.id.toString())
                      ? removeFromFavorites(pokemon.id.toString())
                      : addToFavorites(pokemon.id.toString());
                  }}
                ></IconButton>
                <IconButton
                  icon="plus"
                  style={styles.favButton}
                  onPress={() => setTeamModalVisible(true)}
                ></IconButton>
              </View>
            </View>

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
              <View style={styles.statsContainer}>
                <View>
                  {pokemon?.stats.map((stat) => (
                    <View key={stat.stat.name} style={styles.statRow}>
                      <Text style={styles.statName}>{stat.stat.name}:</Text>
                      <Text style={styles.statValue}>{stat.base_stat}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ marginLeft: 64 }}>
                  <RadarChart
                    data={pokemon?.stats.map((stat) => {
                      const statName =
                        stat.stat.name.charAt(0).toUpperCase() +
                        stat.stat.name.slice(1);
                      const statValue = stat.base_stat;
                      return {
                        label: statName,
                        value: statValue,
                      };
                    })}
                    stroke={[
                      "#006176",
                      "#006176",
                      "#006176",
                      "#006176",
                      "#000000",
                    ]}
                    labelSize={12}
                    labelColor={colors.onSurface}
                    strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
                    strokeOpacity={[1, 1, 1, 1, 1]}
                    gradientColor={{
                      startColor: colors.surface,
                      endColor: colors.surface,
                      count: 5,
                    }}
                    maxValue={200}
                    dataFillColor="#23c55e50"
                    size={200}
                  />
                </View>
              </View>

              <Text style={styles.sectionTitle}>Abilities</Text>
              {pokemon?.abilities.map((ability) => (
                <Text key={ability.ability.name} style={styles.ability}>
                  {ability.ability.name}
                </Text>
              ))}
            </View>
            <View style={styles.navigationButtons}>
              <IconButton
                style={styles.button}
                icon="chevron-left"
                onPress={goToPreviousPokemon}
                disabled={parseInt(id) <= 1}
              />

              <IconButton
                style={styles.button}
                icon="chevron-right"
                onPress={goToNextPokemon}
                disabled={parseInt(id) >= 1000000}
              />
            </View>
          </Card>
          <AddToTeamModal
            visible={teamModalVisible}
            onDismiss={() => setTeamModalVisible(false)}
            pokemon={{
              name: pokemon?.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
            }}
            teams={teams}
          />
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
  favButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
