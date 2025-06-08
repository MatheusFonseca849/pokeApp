import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useContext } from "react";
import { TeamsContext } from "../providers/TeamsContext";

const TeamCard = ({ team, onPress, onEdit, onAddPokemon }) => {
  const { removeTeam } = useContext(TeamsContext);

  return (
    <Card
      style={{
        borderWidth: 3,
        borderLeftWidth: 32,
        borderColor: team.color,
        marginBottom: 16,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 8 }}>
          {team.name}
        </Text>
        <Card.Actions>
          <IconButton icon="delete" onPress={() => removeTeam(team.id)} />
          <IconButton icon="pencil" onPress={() => onEdit(team)} />
        </Card.Actions>
      </View>
      <Card.Content style={{ flex: 1, flexDirection: "row" }}>
        <FlatList
          style={{ flex: 1, flexDirection: "row" }}
          data={team.pokemon}
          ListFooterComponent={() => 
            team.pokemon.length < 6 ? 
            <TouchableOpacity
            onPress={(e) => {
              e.preventDefault()
              onAddPokemon()
            }}
            >

              <IconButton icon="plus" size={24} />
            </TouchableOpacity>
            : null
          }
          renderItem={({ item }) => {
            const pokemonId = item.url.slice(34, -1);
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            return (
              <Image
              key={pokemonId}
              source={{ uri: imageUrl }}
              style={{ width: 48, height: 48 }}
              />
            );
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default TeamCard;
