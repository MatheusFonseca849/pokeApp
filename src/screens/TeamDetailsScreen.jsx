import { Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeContext";

const TeamDetailsScreen = ({route}) => {
    const {team} = route.params;
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    
    // Set the header title to the team name
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: team.name,
            headerStyle: {
                backgroundColor: team.color,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation, team]);

    console.log(team)

    return(
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={{ borderWidth: 3, borderLeftWidth: 32, borderColor: team.color, margin: 16 }}>
                <Card.Title title={`${team.name} Details`} />
                <Card.Content>
                    <Text style={{ marginBottom: 10 }}>Team Color: {team.color}</Text>
                    <Text>Pokemon Count: {team.pokemon.length}</Text>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default TeamDetailsScreen