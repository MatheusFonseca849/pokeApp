import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';

export default function HomeScreen() {

    const [pokeList, setPokeList] = useState([])
    const [loading, setLoading] = useState(false)
    const [next, setNext] = useState('')
    const [previous, setPrevious] = useState('')
    
    const baseUrl = 'https://pokeapi.co/api/v2/'

    const loadPokemon = async () => {
        axios.get(`${baseUrl}pokemon`)
        .then(response => {
          console.log(response.data)
          setPokeList(response.data.results);
          setNext(response.data.next)
          response.data.previous && setPrevious(response.data.previous)
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load Pokémon:', error);
          setLoading(false);
        });
    }

    useEffect(() => {
        loadPokemon()
      }, []);

  return (
    <FlatList
    style={styles.list}
    data={pokeList}
    renderItem={({item}) => {

        const pokeId = item.url.slice(34, -1)
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`

        return (
            <Card style={styles.card}>
                <Text style={styles.title}>{pokeId}</Text>
                <View style={styles.container}>
                <Image
                source={{uri: imgUrl}}
                style={{
                    width: 64,
                    height: 64
                }}
                />
                <Text>{item.name}</Text>
                </View>
            </Card>
        )
    }}
    />
  )
}

const styles = StyleSheet.create({
    list: {
        marginBottom: 32
    },
    card: {
        display: 'flex',
        gap: 5,
        marginBottom: 8

    },
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12
    },
    title: {
        fontSize: 22,
        margin: 5
    }
})