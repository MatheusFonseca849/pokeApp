import { useState, useEffect } from "react"
import { View, Text } from "react-native"
import { FlatList } from "react-native-gesture-handler"

const ItemsScreen = () => {

    const [items, setItems] = useState([])

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        const response = await fetch("https://pokeapi.co/api/v2/item")
        const data = await response.json()
        setItems(data.results)
    }

    return (
        <View>
            <Text>Items</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </View>
    )
}

export default ItemsScreen
