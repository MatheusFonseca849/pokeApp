import { ThemeContext } from "../providers/ThemeContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import TeamModal from "../components/TeamModal";
import { Text } from "react-native";
import { FAB } from "react-native-paper";
import { TeamsContext } from "../providers/TeamsContext";
import { FlatList } from "react-native";
import TeamCard from "../components/TeamCard";
import { useNavigation } from "@react-navigation/native";
import AddPokemonModal from "../components/AddPokemonModal";

const TeamsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [addPokemonModalVisible, setAddPokemonModalVisible] = useState(false);

  const { loadTeams, teams, createTeam, updateTeam, modalReopenData, setModalReopenData } = useContext(TeamsContext);

  const navigation = useNavigation();

  useEffect(() => {
    if (modalReopenData) {
      // Reopen the modal with the saved data
      setTeamToEdit({ 
        id: modalReopenData.teamId, 
        color: modalReopenData.teamColor 
      });
      setAddPokemonModalVisible(true);
      // Reset the reopen data
      setModalReopenData(null);
    }
  }, [modalReopenData]);

  const editTeam = (team) => {
    setTeamToEdit(team);
    setModalVisible(true);
  };

  const handleTeamSubmit = (teamData, isEdit) => {
    if (isEdit) {
      updateTeam(teamData);
    } else {
      createTeam(teamData);
    }
    setTeamToEdit(null);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {teams.length == 0 ? (
        <Text
          style={{
            color: theme.colors.onSurface,
            textAlign: "center",
            marginTop: 20,
            fontSize: 20,
          }}
        >
          Nenhum time encontrado
        </Text>
      ) : (
        <FlatList
          data={teams}
          renderItem={({ item }) => (
            <TeamCard
              key={item.id}
              team={item}
              onEdit={() => editTeam(item)}
              onPress={() =>
                navigation.navigate("TeamDetails", { teamId: item.id })
              }
              onAddPokemon={() => {
                setAddPokemonModalVisible(true);
                setTeamToEdit(item);
              }}
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 52,
          backgroundColor: theme.colors.primary,
        }}
        onPress={() => {
          setModalVisible(true);
          setTeamToEdit(null);
        }}
      />
      <TeamModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setTeamToEdit(null);
        }}
        onSubmit={handleTeamSubmit}
        teamToEdit={teamToEdit}
      />
      <AddPokemonModal
        visible={addPokemonModalVisible}
        onDismiss={() => setAddPokemonModalVisible(false)}
        teamId={teamToEdit?.id}
        teamColor={teamToEdit?.color}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TeamsScreen;
