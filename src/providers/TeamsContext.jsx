import { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
export const TeamsContext = createContext();
export const TeamsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#cccccc");

  const hasLoaded = useRef(false); // prevent initial write on mount

  const loadTeams = async () => {
    try {
      setLoading(true);
      const storedTeams = await AsyncStorage.getItem("@teams");
      const parsed = storedTeams ? JSON.parse(storedTeams) : [];
      setTeams(parsed);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
      hasLoaded.current = true;
    }
  };

  const createTeam = (newTeam) => {
    if (teams.some((team) => team.name === newTeam.name)) {
      Toast.show({
        type: "error",
        text1: "Time com esse nome ja existe",
        position: 'top-right'
      });
      return;
    }
    setTeams((prev) => [...prev, newTeam]);
    Toast.show({
      type: "success",
      text1: "Time criado com sucesso",
    });
  };

  const updateTeam = (updatedTeam) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === updatedTeam.id ? updatedTeam : team
      )
    );
    
    Toast.show({
      type: "success",
      text1: "Time atualizado com sucesso",
      position: 'top'
    });
  };

  const removeTeam = (teamId) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    Toast.show({
      type: "error",
      text1: "Time removido com sucesso",
      position: 'top-right'
    });
  };

  const addPokemonToTeam = (teamId, pokemon) => {
    const team = teams.find((team) => team.id === teamId);
    if (!team) return;
    if (team.pokemon.length >= 6) {
      Toast.show({
        type: "error",
        text1: "Time cheio",
        position: 'top-right'
      });
      return;
    }

    const pokemonExists = team.pokemon.some((p) => p.url === pokemon.url);
    if (pokemonExists) {
      Toast.show({
        type: "error",
        text1: "Pokemon ja adicionado",
        position: 'top-right'
      });
      return;
    }

    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, pokemon: [...team.pokemon, pokemon] }
          : team
      )
    );
    Toast.show({
      type: "success",
      text1: "Pokemon adicionado com sucesso",
      position: 'top-right'
    });
    
  };

  const removePokemonFromTeam = (teamId, pokemon) => {
    const team = teams.find((team) => team.id === teamId);
    if (!team) return;
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              pokemon: team.pokemon.filter((p) => p.url !== pokemon.url),
            }
          : team
      )
    );
  };

  useEffect(() => {
    if (!hasLoaded.current) return;
    AsyncStorage.setItem("@teams", JSON.stringify(teams)).catch((err) =>
      console.error("Error saving teams:", err)
    );
  }, [teams]);

  return (
    <TeamsContext.Provider
      value={{
        teams,
        teamName,
        color,
        backgroundColor,
        setTeams,
        setTeamName,
        setColor,
        setBackgroundColor,
        loadTeams,
        createTeam,
        removeTeam,
        addPokemonToTeam,
        removePokemonFromTeam,
        updateTeam,
        loading,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
