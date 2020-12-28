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
  let microsoftData = require("./microsoft.json");

  let [defaultStocks, setDefaultStocks] = React.useState({
    "tesla data": teslaData,
    "microsoft data": microsoftData,
  });

  let [chosenStock, setChosenStock] = React.useState(microsoftData);

  let [startSetup, setStartSetup] = React.useState(["x"]);
  let [chartSetup, setChartSetup] = React.useState([]);

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
      if (oldData.price.length >= 6) {
        return;
      }
      check();
    };
    check();
    if (oldData.price.length >= 6) {
      let oldDataGoodFormat = {
        price: [],
        day: [],
      };
      for (let i = oldData.price.length - 1; i > 0; i = i - 1) {
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

  let startTrading = () => {
    setStartSetup([]);
    setChartSetup(["x"]);
  };

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
        stockData.day.push(simpleDateFormat(gameTime));
        gameTime = gameTime + 86400000;
      }
    };
    check();
    setGameTime(gameTime);
    setStockData(stockData);
    setRerender(!rerender);
  };

  let settingStockData = (value) => {
    console.log(value);
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
        <RNPickerSelect
          onValueChange={(value) => settingStockData(value)}
          placeholder={{
            label: "Microsoft",
            value: "microsoft",
            color: "black",
          }}
          items={[
            { label: "Tesla", value: "tesla", color: "black" },
            { label: "Hockey", value: "microsoft", color: "black" },
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
  margintop: {
    width: "50%",
    flex: 1,
    backgroundColor: "#b3c6ff",
    justifyContent: "space-evenly",
  },
});
