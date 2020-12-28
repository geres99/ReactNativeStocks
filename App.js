import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button, Text, View, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export default function App() {
  let [gameTime, setGameTime] = React.useState(1546340400000);

  let dateFormat = (milisecs) => {
    let ourDate = new Date(milisecs);
    let day = ourDate.getDate();
    if (day.toString().length < 2) {
      day = "0" + day;
    }
    let month = ourDate.getMonth() + 1;
    if (month.toString().length < 2) {
      month = "0" + month;
    }
    let year = ourDate.getFullYear();
    return year + "-" + month + "-" + day;
  };
  let simpleDateFormat = (milisecs) => {
    let ourDate = new Date(milisecs);
    let day = ourDate.getDate();
    if (day.toString().length < 2) {
      day = "0" + day;
    }
    let month = ourDate.getMonth() + 1;
    if (month.toString().length < 2) {
      month = "0" + month;
    }
    return day + "." + month;
  };

  let teslaData = require("./tesla.json");

  let oldTesla = () => {
    let timeTravelTime = gameTime;
    let oldData = { price: [], day: [] };
    let check = () => {
      if (
        teslaData["Time Series (Daily)"][dateFormat(timeTravelTime)] ===
        undefined
      ) {
        timeTravelTime = timeTravelTime - 86400000;
        check();
      } else {
        oldData.price.push(
          teslaData["Time Series (Daily)"][dateFormat(timeTravelTime)][
            "1. open"
          ]
        );
        oldData.day.push(simpleDateFormat(timeTravelTime));
        timeTravelTime = timeTravelTime - 86400000;
      }
      if (oldData.price.length >= 5) {
        return oldData;
      }
    };
  };

  let [year2019, setYear2019] = React.useState([
    "01.01",
    "02.01",
    "03.01",
    "04.01",
    "05.01",
    "06.01",
    "07.01",
    "08.01",
    "09.01",
    "10.01",
  ]);

  let [rerender, setRerender] = React.useState(true);
  let [stockData, setStockData] = React.useState({
    day: year2019.slice(0, 5),
    price: [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
    ],
  });

  let nextDay = () => {
    stockData.day = stockData.day.splice(1, 5);
    stockData.price = stockData.price.splice(1, 5);
    let check = () => {
      if (
        teslaData["Time Series (Daily)"][dateFormat(gameTime)] === undefined
      ) {
        gameTime = gameTime + 86400000;
        check();
      } else {
        stockData.price.push(
          teslaData["Time Series (Daily)"][dateFormat(gameTime)]["1. open"]
        );
        stockData.day.push(simpleDateFormat(gameTime));
        gameTime = gameTime + 86400000;
      }
    };
    check();
    setGameTime(gameTime);
    setStockData(stockData);
    setRerender(!rerender);
  };

  return (
    <View style={styles.container}>
      <View>
        <LineChart
          data={{
            labels: stockData.day,
            datasets: [
              {
                data: stockData.price,
              },
            ],
          }}
          width={Dimensions.get("window").width - 10} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#007acc",
            backgroundGradientTo: "#0099ff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#003d66",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <Button title="Next Day" onPress={nextDay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
