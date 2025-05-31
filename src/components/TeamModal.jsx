import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";
import WheelColorPicker from "react-native-wheel-color-picker";
import { useContext } from "react";
import { TeamsContext } from "../providers/TeamsContext";

const TeamModal = ({ visible, onDismiss, onSubmit }) => {
  const [pickerTarget, setPickerTarget] = useState(null);

  const { teamName, color, backgroundColor, setTeamName, setColor, setBackgroundColor } = useContext(TeamsContext);

  const handleSave = () => {
    if (!teamName) return;

    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      color,
      backgroundColor,
      pokemon: [],
    };
    onSubmit(newTeam);
    resetForm();
  };

  const resetForm = () => {
    setTeamName("");
    setColor("#000000");
    setBackgroundColor("#cccccc");
    setPickerTarget(null);
    onDismiss();
  };

  const handleColorSelect = (newColor) => {
    if (pickerTarget === "color") setColor(newColor);
    if (pickerTarget === "background") setBackgroundColor(newColor);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={resetForm}>
        <Dialog.Title>Criar novo time</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nome do time"
            value={teamName}
            onChangeText={setTeamName}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />

          {/* Color Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: color }]}
              onPress={() =>
                setPickerTarget(pickerTarget === "color" ? null : "color")
              }
            >
              <Text style={styles.buttonText}>Cor Principal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: backgroundColor }]}
              onPress={() =>
                setPickerTarget(
                  pickerTarget === "background" ? null : "background"
                )
              }
            >
              <Text style={styles.buttonText}>Cor de Fundo</Text>
            </TouchableOpacity>
          </View>

          {/* Color Picker (Conditional) */}
          {pickerTarget && (
            <View style={{ height: 200, marginTop: 12, marginBottom: 58 }}>
              <WheelColorPicker
                color={pickerTarget === "color" ? color : backgroundColor}
                onColorChangeComplete={handleColorSelect}
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={resetForm}>Cancelar</Button>
          <Button onPress={() => {
            if(!teamName){
              alert("Por favor, insira um nome para o time.");
              return;
            }
            handleSave()
            resetForm()
            }}>Salvar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  colorButton: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "#0005",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default TeamModal;
