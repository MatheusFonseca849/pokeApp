import { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    setTeams((prev) => [...prev, newTeam]);
  };

  const addPokemonToTeam = (teamId, pokemon) => {
    
    const team = teams.find(team => team.id === teamId);
    if (!team) return;
    if (team.pokemon.length >= 6) {
      alert("Time cheio");
      return;
    }

    const pokemonExists = team.pokemon.some((p) => p.url === pokemon.url);
    if (pokemonExists) {
      alert("Pokemon ja adicionado");
      return;
    }

    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, pokemon: [...team.pokemon, pokemon] }
          : team
      )
    );
  };

  const removePokemonFromTeam = (teamId, pokemon) => {
    const team = teams.find(team => team.id === teamId);
    if (!team) return;
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, pokemon: team.pokemon.filter((p) => p.url !== pokemon.url) }
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
        addPokemonToTeam,
        removePokemonFromTeam,
        loading,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
