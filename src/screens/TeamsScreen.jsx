import { View, Text } from "react-native";
import { ThemeContext } from "../providers/ThemeContext";
import { useContext } from "react";
import { Card, IconButton, Title } from "react-native-paper";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import TeamModal from "../components/TeamModal";
import { FAB } from 'react-native-paper';

const TeamsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
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
    AsyncStorage.getItem("@teams").then((teams) => {
      if (teams) {
        const teamsList = JSON.parse(teams);
        setTeams(teamsList);
      }
    });
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teams = await AsyncStorage.getItem("teams");
      const teamsList = teams ? JSON.parse(teams) : [];
      setTeams(teamsList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading teams:", error);
      setLoading(false);
    }
  };

  const createTeam = async (team) => {
    console.log('Creating Team')
    try {
        setLoading(true);
        const teams = await AsyncStorage.getItem('teams');
        const teamsList = teams ? JSON.parse(teams) : [];
        teamsList.push(team);
        await AsyncStorage.setItem('teams', JSON.stringify(teamsList));
        setTeams(teamsList);
        setLoading(false);
    } catch (error) {
        console.error('Error creating team:', error);
        setLoading(false);
    }
  };
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
        <Card style={{ backgroundColor: theme.colors.background }}>
          <Text style={{ color: theme.colors.onSurface }}>Times</Text>
          <IconButton icon="plus" onPress={() => {createTeam()}} />
        </Card>
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            right: 16,
            bottom: 52,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => setModalVisible(true)}
        />
        <TeamModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSubmit={createTeam}
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
