import { FlatList, Image } from "react-native";
import { Card } from "react-native-paper";

const TeamCard = ({team, onPress}) => {

    return (
        <Card style={{ borderWidth: 3, borderLeftWidth: 32, borderColor: team.color, marginBottom: 8 }} onPress={onPress}>
            <Card.Title title={team.name} />
            <Card.Content>
                <FlatList
                    style={{flex: 1, flexDirection: 'row'}}
                    
                    data={team.pokemon}
                    renderItem={({item}) => {
                        const pokemonId = item.url.slice(34, -1);
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                        return(
                            <Image
                                key={pokemonId}
                                source={{ uri: imageUrl }}
                                style={{ width: 48, height: 48 }}
                            />
                        )
                    }}
                    keyExtractor={(item) => item.id}
                />
            </Card.Content>
        </Card>
    );
};

export default TeamCard;