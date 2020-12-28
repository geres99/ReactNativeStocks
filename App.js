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
    stockData.day.push(year2019.splice(stockData.day.length + 1, 1));
    stockData.price.push(Math.random() * 100);
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
