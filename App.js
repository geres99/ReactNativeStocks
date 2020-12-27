import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button, Text, View, Dimensions } from "react-native";

export default function App() {
  let windowHeight = Dimensions.get("window").height;
  let windowWidth = Dimensions.get("window").width;

  let maxHeight = windowHeight * 0.5 * 0.5 - 50;
  let maxWidth = windowWidth * 0.9 * 0.5 - 50;

  let minHeight = windowHeight * 0.5 * -0.5;
  let minWidth = windowWidth * 0.9 * -0.5;

  let [rerender, setRerender] = React.useState(true);
  let [rerenderInterval, setRerenderInterval] = React.useState(true);
  let [dice, setDice] = React.useState({
    diceMaxRoll: 6,
    dices: [
      {
        positionX: maxWidth,
        positionY: maxHeight,
        value: 1,
        changingX: 1,
        changingY: 1,
      },
      {
        positionX: minWidth,
        positionY: minHeight,
        value: 1,
        changingX: 1,
        changingY: 1,
      },
    ],
  });

  let roll = () => {
    for (let i = 0; i < dice.dices.length; i++) {
      dice.dices[i].value = Math.ceil(Math.random() * dice.diceMaxRoll);
    }
    let intervalFunction = () => {
      for (let i = 0; i < dice.dices.length; i++) {
        if (dice.dices[i].positionX >= maxWidth) {
          dice.dices[i].changingX = -1;
        }
        if (dice.dices[i].positionX <= minWidth) {
          dice.dices[i].changingX = 1;
        }
        dice.dices[i].positionX =
          dice.dices[i].positionX + dice.dices[i].changingX;
        setDice(dice);
        setRerenderInterval(Math.random());
      }
    };
    setInterval(intervalFunction, 100);
    setDice(dice);
    setRerender(!rerender);
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {dice.dices.map((x) => (
          <View style={{ left: x.positionX, top: x.positionY }}>
            <View style={styles.dice}>
              <Text>{x.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <Button title="Roll" onPress={roll}></Button>
      <Text>
        {windowHeight} {windowWidth}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  board: {
    height: "50%",
    width: "90%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  dice: {
    position: "absolute",
    height: 50,
    width: 50,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius: 6,
  },
});
