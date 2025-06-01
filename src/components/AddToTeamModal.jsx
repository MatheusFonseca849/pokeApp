import { Portal, Dialog, TextInput, Button } from "react-native-paper";
import { useContext } from "react";
import { TeamsContext } from "../providers/TeamsContext";
import { Text, View, FlatList } from "react-native";

const AddToTeamModal = ({ visible, onDismiss, pokemon }) => {
  const { teams, addPokemonToTeam } = useContext(TeamsContext);
  const handleSave = (teamId) => {
    const team = teams.find((team) => team.id === teamId);
    if (!team) return;
    addPokemonToTeam(teamId, pokemon);
    resetForm();
  };
  const resetForm = () => {
    onDismiss();
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={resetForm}>
        <Dialog.Title>Adicionar ao time</Dialog.Title>
        <Dialog.Content>
          {teams.length === 0 ? (
            <Text>Nenhum time encontrado</Text>
          ) : (
            <View>
              <FlatList
                data={teams}
                renderItem={({ item }) => (
                  <Button onPress={() => handleSave(item.id)}>
                    {item.name}
                  </Button>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddToTeamModal;
