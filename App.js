import React from "react";
import { StyleSheet, Button, Text, View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import RNPickerSelect from "react-native-picker-select";
import { TextInput } from "react-native";

export default function App() {
  let size = useWindowSize();

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
    let oldData = { price: [], day: [], date: [] };
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
        oldData.date.push(timeTravelTime);
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
        date: [],
      };
      for (let i = oldData.price.length - 1; i >= 0; i = i - 1) {
        oldDataGoodFormat.price.push(oldData.price[i]);
        oldDataGoodFormat.day.push(oldData.day[i]);
        oldDataGoodFormat.date.push(oldData.date[i]);
      }
      return oldDataGoodFormat;
    }
  };

  let [rerender, setRerender] = React.useState(true);
  let [stockData, setStockData] = React.useState({
    day: chosenOldData().day,
    price: chosenOldData().price,
    date: chosenOldData().date,
  });

  let nextDay = () => {
    gameTime = gameTime + 86400000;
    let daysInChart = stockData.day.splice(1, 5);
    stockData.day = daysInChart;
    let pricesInChart = stockData.price.splice(1, 5);
    stockData.price = pricesInChart;
    let dateInChart = stockData.date.splice(1, 5);
    stockData.date = dateInChart;
    let check = () => {
      if (
        chosenStock["Time Series (Daily)"][dateFormat(gameTime)] === undefined
      ) {
        gameTime = gameTime + 86400000;
        check();
      } else {
        if (
          daysInChart[0] !== simpleDateFormat(gameTime) &&
          stockData.day[0] !== simpleDateFormat(gameTime) &&
          stockData.day[1] !== simpleDateFormat(gameTime) &&
          stockData.day[2] !== simpleDateFormat(gameTime) &&
          stockData.day[3] !== simpleDateFormat(gameTime)
        ) {
          stockData.price.push(
            chosenStock["Time Series (Daily)"][dateFormat(gameTime)]["1. open"]
          );
          stockData.date.push(gameTime);
          stockData.day.push(simpleDateFormat(gameTime));
        } else {
          gameTime = gameTime + 86400000;
          check();
        }
      }
    };
    check();
    setGameTime(gameTime);
    setStockData(stockData);
    setRerender(!rerender);
  };

  let previousDay = () => {
    let newChart = { day: [], price: [], date: [] };
    for (let i = stockData.price.length - 1; i >= 0; i = i - 1) {
      newChart.day.push(stockData.day[i]);
      newChart.price.push(stockData.price[i]);
      newChart.date.push(stockData.date[i]);
    }
    stockData.day = newChart.day.splice(1, 5);
    stockData.price = newChart.price.splice(1, 5);
    stockData.date = newChart.date.splice(1, 5);

    let check = () => {
      if (
        chosenStock["Time Series (Daily)"][dateFormat(gameTime)] === undefined
      ) {
        gameTime = gameTime - 86400000;
        check();
      } else {
        if (
          newChart.day[0] !== simpleDateFormat(gameTime) &&
          stockData.day[0] !== simpleDateFormat(gameTime) &&
          stockData.day[1] !== simpleDateFormat(gameTime) &&
          stockData.day[2] !== simpleDateFormat(gameTime) &&
          stockData.day[3] !== simpleDateFormat(gameTime)
        ) {
          stockData.price.push(
            chosenStock["Time Series (Daily)"][dateFormat(gameTime)]["1. open"]
          );
          stockData.date.push(gameTime);
          stockData.day.push(simpleDateFormat(gameTime));
        } else {
          gameTime = gameTime - 86400000;
          check();
        }
      }
    };
    check();

    newChart = { day: [], price: [], date: [] };

    for (let i = stockData.price.length - 1; i >= 0; i = i - 1) {
      newChart.day.push(stockData.day[i]);
      newChart.price.push(stockData.price[i]);
      newChart.date.push(stockData.date[i]);
    }

    setGameTime(gameTime);
    setStockData(newChart);
    setRerender(!rerender);
  };

  let settingStockData = (value) => {
    let prepearingName = value + " data";
    setStockData({
      day: chosenOldData(defaultStocks[prepearingName]).day,
      price: chosenOldData(defaultStocks[prepearingName]).price,
      date: chosenOldData(defaultStocks[prepearingName]).date,
    });
    setChosenStock(defaultStocks[prepearingName]);
  };

  let addStock = () => {
    let addingStocks = (name, data) => {
      if (data["Time Series (Daily)"] === undefined) {
      } else {
        setAddedStocks([
          ...addedStocks,
          { label: name, value: name, color: "#00001a" },
        ]);
        defaultStocks[name + " data"] = data;
        setDefaultStocks(defaultStocks);
        setInputValue("");
        setRerender(!rerender);
      }
    };

    async function getStockDataFromApi() {
      try {
        let response = await fetch(
          "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" +
            inputValue +
            "&outputsize=full&apikey=BQAIUGFT8QTILWMH"
        );
        let responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.error(error);
      }
    }

    let dataFromAPI = getStockDataFromApi();
    dataFromAPI.then((data) => addingStocks(inputValue, data));
  };

  let [addedStocks, setAddedStocks] = React.useState([
    { label: "Apple", value: "apple", color: "#00001a" },
    { label: "Tesla", value: "tesla", color: "#00001a" },
    { label: "Google", value: "google", color: "#00001a" },
    { label: "Amazon", value: "amazon", color: "#00001a" },
  ]);
  let [inputValue, setInputValue] = React.useState("");

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,

      height: undefined,
    });

    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,

          height: window.innerHeight,
        });
      }

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text style={styles.bigText}>{"Stock Price:"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bigText}>
            {stockData.price[4]}
            {"$"}
          </Text>
        </View>
        <View style={styles.row}>
          <Button title="<" onPress={previousDay} />
          <Text style={styles.bigText}>{dateFormat(stockData.date[4])}</Text>
          <Button title=">" onPress={nextDay} />
        </View>
        <RNPickerSelect
          onValueChange={(value) => settingStockData(value)}
          placeholder={{
            label: "Microsoft",
            value: "microsoft",
            color: "#00001a",
          }}
          items={addedStocks}
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
          width={Dimensions.get("window").width - 10}
          height={220}
          yAxisLabel="$"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#007acc",
            backgroundGradientTo: "#0099ff",
            decimalPlaces: 2,
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
      <View style={styles.row}>
        <Text style={styles.bigText}>{"Add new stocks:"}</Text>
      </View>
      <View style={styles.stockAdder}>
        <TextInput
          style={{
            height: 35,
            backgroundColor: "#ffffff",
          }}
          onChangeText={(text) => setInputValue(text)}
          value={inputValue}
        />
        <Button color="#33ff33" title="+" onPress={addStock} />
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
  bigText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  stockAdder: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
  },
});
