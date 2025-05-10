import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PokemonDetailsScreen = ({ route }) => {
    const { id } = route.params;
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => {
                setPokemon(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Pokemon details:', error);
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
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>{pokemon?.name}</Text>
                
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: pokemon?.sprites?.front_default }}
                        style={styles.image}
                    />
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Types</Text>
                    <View style={styles.typesContainer}>
                        {pokemon?.types.map(typeInfo => (
                            <Text key={typeInfo.type.name} style={styles.type}>
                                {typeInfo.type.name}
                            </Text>
                        ))}
                    </View>
                    
                    <Text style={styles.sectionTitle}>Stats</Text>
                    {pokemon?.stats.map(stat => (
                        <View key={stat.stat.name} style={styles.statRow}>
                            <Text style={styles.statName}>{stat.stat.name}:</Text>
                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                        </View>
                    ))}
                    
                    <Text style={styles.sectionTitle}>Abilities</Text>
                    {pokemon?.abilities.map(ability => (
                        <Text key={ability.ability.name} style={styles.ability}>
                            {ability.ability.name}
                        </Text>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        padding: 16,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    imageContainer: {
        alignItems: 'center',
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
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    typesContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    type: {
        backgroundColor: '#4264a8',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        textTransform: 'capitalize',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    statName: {
        textTransform: 'capitalize',
    },
    statValue: {
        fontWeight: 'bold',
    },
    ability: {
        textTransform: 'capitalize',
        marginLeft: 8,
    }
});

export default PokemonDetailsScreen;
