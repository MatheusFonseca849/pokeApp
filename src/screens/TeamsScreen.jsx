import { Text } from "react-native";
import { ThemeContext } from "../providers/ThemeContext";
import { useContext } from "react";
import { Card, IconButton } from "react-native-paper";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import TeamModal from "../components/TeamModal";
import { FAB } from "react-native-paper";
import { TeamsContext } from "../providers/TeamsContext";
import { FlatList } from "react-native";
import TeamCard from "../components/TeamCard";
import { useNavigation } from "@react-navigation/native";

const TeamsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);

  const { loadTeams, teams, createTeam, updateTeam } = useContext(TeamsContext);

  const navigation = useNavigation();
  console.log(teams);
  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };

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
    setTeamToEdit(null); // Clear the edit state after submission
  };
  /* 
    Team Object sample

    {
        name: "Team Name",
        id: "Team ID",
        color: "#FF0000",
        backgroundColor: "#FF000060"
        pokemon: [
            {
                name: "Pokemon Name",
                url: "Pokemon URL"
            },
            {
                name: "Pokemon Name",
                url: "Pokemon URL"
            }
        ]
    }
    */

  useEffect(() => {
    loadTeams();
  }, []);

  const { theme } = useContext(ThemeContext);
  return (
    <GestureRecognizer
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onSwipeLeft={() => {
        console.log("Swiped Left");
      }}
      onSwipeRight={() => {
        console.log("Swiped Right");
      }}
      config={swipeConfig}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
            />
          )}
        />
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
      </SafeAreaView>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TeamsScreen;
