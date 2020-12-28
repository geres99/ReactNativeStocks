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
import RNPickerSelect from "react-native-picker-select";
import { TextInput } from "react-native";

export default function App() {
  let [gameTime, setGameTime] = React.useState(1546426800000);

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
  let microsoftData = require("./microsoft.json");
  let appleData = require("./apple.json");
  let amazonData = require("./amazon.json");
  let googleData = require("./google.json");

  let [defaultStocks, setDefaultStocks] = React.useState({
    "tesla data": teslaData,
    "microsoft data": microsoftData,
    "apple data": appleData,
    "amazon data": amazonData,
    "google data": googleData,
  });

  let [chosenStock, setChosenStock] = React.useState(microsoftData);

  let chosenOldData = (data) => {
    if (data !== undefined) {
      chosenStock = data;
    }
    let timeTravelTime = gameTime;
    let oldData = { price: [], day: [] };
    let check = () => {
      if (
        chosenStock["Time Series (Daily)"][dateFormat(timeTravelTime)] ===
        undefined
      ) {
        timeTravelTime = timeTravelTime - 86400000;
        check();
      } else {
        oldData.price.push(
          chosenStock["Time Series (Daily)"][dateFormat(timeTravelTime)][
            "1. open"
          ]
        );
        oldData.day.push(simpleDateFormat(timeTravelTime));
        timeTravelTime = timeTravelTime - 86400000;
      }
      if (oldData.price.length >= 5) {
        return;
      }
      check();
    };
    check();
    if (oldData.price.length >= 5) {
      let oldDataGoodFormat = {
        price: [],
        day: [],
      };
      for (let i = oldData.price.length - 1; i >= 0; i = i - 1) {
        oldDataGoodFormat.price.push(oldData.price[i]);
        oldDataGoodFormat.day.push(oldData.day[i]);
      }
      return oldDataGoodFormat;
    }
  };

  let [rerender, setRerender] = React.useState(true);
  let [stockData, setStockData] = React.useState({
    day: chosenOldData().day,
    price: chosenOldData().price,
  });

  let nextDay = () => {
    stockData.day = stockData.day.splice(1, 5);
    stockData.price = stockData.price.splice(1, 5);
    let check = () => {
      if (
        chosenStock["Time Series (Daily)"][dateFormat(gameTime)] === undefined
      ) {
        gameTime = gameTime + 86400000;
        check();
      } else {
        stockData.price.push(
          chosenStock["Time Series (Daily)"][dateFormat(gameTime)]["1. open"]
        );
        gameTime = gameTime + 86400000;
        stockData.day.push(simpleDateFormat(gameTime));
      }
    };
    check();
    setGameTime(gameTime);
    setStockData(stockData);
    setRerender(!rerender);
  };

  let startingDay = () => {
    let startingTime = gameTime;
    let today = { day: 0, price: 0 };
    let check = () => {
      if (
        chosenStock["Time Series (Daily)"][dateFormat(startingTime)] ===
        undefined
      ) {
        startingTime = startingTime - 86400000;
        check();
      } else {
        today.price =
          chosenStock["Time Series (Daily)"][dateFormat(startingTime)][
            "1. open"
          ];

        today.day = dateFormat(startingTime);
        startingTime = gameTime + 86400000;
      }
    };
    check();
    return today;
  };

  let settingStockData = (value) => {
    let prepearingName = value + " data";
    setStockData({
      day: chosenOldData(defaultStocks[prepearingName]).day,
      price: chosenOldData(defaultStocks[prepearingName]).price,
    });
    setChosenStock(defaultStocks[prepearingName]);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text>{startingDay().day}</Text>
          <Text>{dateFormat(gameTime)}</Text>
        </View>
        <View style={styles.row}>
          <Text>{dateFormat(gameTime)}</Text>
        </View>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            backgroundColor: "#ffffff",
          }}
          onChangeText={(text) => onChangeText(text)}
          value={"Yieks"}
        />
        <RNPickerSelect
          onValueChange={(value) => settingStockData(value)}
          placeholder={{
            label: "Microsoft",
            value: "microsoft",
            color: "#00001a",
          }}
          items={[
            { label: "Apple", value: "apple", color: "#00001a" },
            { label: "Tesla", value: "tesla", color: "#00001a" },
            { label: "Google", value: "google", color: "#00001a" },
            { label: "Amazon", value: "amazon", color: "#00001a" },
          ]}
        />
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
        <View>
          <Button title="Next Day" onPress={nextDay} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3c6ff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  row: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
});
