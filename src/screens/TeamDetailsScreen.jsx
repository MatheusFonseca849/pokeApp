import { Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Card, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { ThemeContext } from "../providers/ThemeContext";
import { TeamsContext } from "../providers/TeamsContext";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import AddPokemonModal from "../components/AddPokemonModal";

const TeamDetailsScreen = ({ route }) => {
  const { teamId } = route.params;
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { teams, removePokemonFromTeam } = useContext(TeamsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  // Set header title to team name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: team.name,
      headerStyle: {
        backgroundColor: team.color,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation, team]);

  const team = teams.find((team) => team.id === teamId);

  console.log(team);

  const onAddPokemon = () => {
    setModalVisible(true);
  };

  if (!team) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Team not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card
        style={{
          borderWidth: 3,
          borderTopWidth: 32,
          borderColor: team.color,
          margin: 16,
        }}
      >
        <Card.Title title={`${team.name} Details`} />
        <Card.Content>
          <Text style={{ marginBottom: 10, color: colors.onSurface }}>
            Team Color: {team.color}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            Pokemon Count: {team.pokemon.length}
          </Text>
        </Card.Content>
        <FlatList
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            backgroundColor: team.backgroundColor,
            margin: 12,
          }}
          ListFooterComponent={() =>
            team.pokemon.length < 6 ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.preventDefault();
                  onAddPokemon();
                }}
              >
                <IconButton icon="plus" size={48} />
              </TouchableOpacity>
            ) : null
          }
          data={team.pokemon}
          renderItem={({ item }) => {
            const pokemonId = item.url.slice(34, -1);
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PokemonDetails", { id: pokemonId })
                }
                style={{ margin: 5, position: "relative" }}
              >
                <Image
                  key={pokemonId}
                  source={{ uri: imageUrl }}
                  style={{ width: 112, height: 112 }}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent's onPress
                    removePokemonFromTeam(team.id, item);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </Card>
      <AddPokemonModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        teamId={team.id}
        teamColor={team.color}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default TeamDetailsScreen;
