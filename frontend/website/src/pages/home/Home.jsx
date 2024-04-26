import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "../../App.css";

function Home() {
  const [chartData, setChartData] = useState({
    Temperature: [],
    SoilMoisture: [],
    LightIntensity: [],
    Humidity: [],
    NutrientLevel: [],
    LeafMovement: [],
  });

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("ws://vscode.samarthasthan.com:1082/ws");

    // Event listener for messages received from the WebSocket server
    ws.onmessage = (event) => {
      // Parse the JSON data received from the server
      const data = JSON.parse(event.data);
      // Update chart data with new data
      setChartData((prevChartData) => {
        // Update data for each field
        const updatedChartData = { ...prevChartData };
        for (const field in data) {
          if (updatedChartData.hasOwnProperty(field)) {
            // Add the new data to the end of the array
            const updatedData = [...updatedChartData[field], data[field]];

            // Ensure that the array has a maximum length of 10
            if (updatedData.length > 20) {
              // If the array length exceeds 10, remove the first element
              updatedData.shift();
            }

            updatedChartData[field] = updatedData;
          }
        }
        return updatedChartData;
      });
    };

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    series: Object.keys(chartData).map((field) => ({
      name: field,
      data: chartData[field],
    })),
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    tooltip: {
      enabled: true,
    },
    colors: ["#18181b"],
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    grid: {
      show: false,
    },
    selection: {
      enabled: true,
    },
  };

  // Function to calculate emotional state based on thresholds
  // Function to calculate emotional state based on thresholds
  const calculateEmotionalState = () => {
    const {
      SoilMoisture,
      LightIntensity,
      Temperature,
      Humidity,
      NutrientLevel,
      LeafMovement,
    } = chartData;

    // Define thresholds for each sensor based on the information provided
    const thresholds = {
      Temperature: {
        healthy: [21, 29],
        tooCold: [0, 21],
        tooHot: [29, 40],
      },
      Humidity: {
        healthy: [60, 70],
        tooDry: [0, 60],
        tooHumid: [70, 100],
      },
      SoilMoisture: {
        dry: [600, 1023],
        humid: [370, 600],
        water: [0, 370],
      },
      LightIntensity: {
        low: [270, 807],
        medium: [807, 1614],
      },
      LeafMovement: {
        low: [0, 1],
        moderate: [1, 2],
        high: [2, 3],
      },
      NutrientLevel: {
        healthy: [2.5, 3.5],
        deficiency: [0, 2.5],
        excess: [3.5, 5],
      },
    };

    // Determine the emotional state based on sensor readings and defined thresholds
    const emotionalState = [];
    const lastTemperature = Temperature[Temperature.length - 1];
    const lastHumidity = Humidity[Humidity.length - 1];
    const lastSoilMoisture = SoilMoisture[SoilMoisture.length - 1];
    const lastLightIntensity = LightIntensity[LightIntensity.length - 1];
    const lastLeafMovement = LeafMovement[LeafMovement.length - 1];
    const lastNutrientLevel = NutrientLevel[NutrientLevel.length - 1];

    if (lastTemperature < thresholds.Temperature.healthy[0]) {
      emotionalState.push("Too cold");
    } else if (lastTemperature > thresholds.Temperature.healthy[1]) {
      emotionalState.push("Too hot");
    }

    if (lastHumidity < thresholds.Humidity.healthy[0]) {
      emotionalState.push("Too dry");
    } else if (lastHumidity > thresholds.Humidity.healthy[1]) {
      emotionalState.push("Too humid");
    }

    if (lastSoilMoisture >= thresholds.SoilMoisture.dry[0]) {
      emotionalState.push("Dry");
    } else if (lastSoilMoisture >= thresholds.SoilMoisture.humid[0]) {
      emotionalState.push("Humid");
    } else if (lastSoilMoisture < thresholds.SoilMoisture.water[0]) {
      emotionalState.push("In water");
    }

    if (lastLightIntensity < thresholds.LightIntensity.low[1]) {
      emotionalState.push("Low light");
    } else if (lastLightIntensity > thresholds.LightIntensity.medium[1]) {
      emotionalState.push("High light");
    }

    if (lastLeafMovement < thresholds.LeafMovement.moderate[0]) {
      emotionalState.push("Low leaf movement");
    } else if (lastLeafMovement > thresholds.LeafMovement.moderate[1]) {
      emotionalState.push("High leaf movement");
    }

    if (lastNutrientLevel < thresholds.NutrientLevel.healthy[0]) {
      emotionalState.push("Nutrient deficiency");
    } else if (lastNutrientLevel > thresholds.NutrientLevel.healthy[1]) {
      emotionalState.push("Nutrient excess");
    }

    if (emotionalState.length === 0) {
      emotionalState.push("Healthy");
    }

    return emotionalState.join(", ");
  };

  const getEmotionIcon = (emotionalState) => {
    if (emotionalState.includes("Healthy")) {
      return "😊";
    } else {
      return "😔";
    }
  };

  return (
    <div>
      <h1 className="emoji">{getEmotionIcon(calculateEmotionalState())}</h1>
      <h2>Emotion State: {calculateEmotionalState()}</h2>
      <div className="stats">
        <div>
          <h3>Temperature</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[{ name: "Temperature", data: chartData.Temperature }]}
            type="line"
            width={"100%"}
          />
        </div>
        <div>
          <h3>Humidity</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[{ name: "Humidity", data: chartData.Humidity }]}
            type="line"
            width={"100%"}
          />
        </div>
        <div>
          <h3>Soil Moisture</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[{ name: "Soil Moisture", data: chartData.SoilMoisture }]}
            type="line"
            width={"100%"}
          />
        </div>
        <div>
          <h3>Light Intensity</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[
              { name: "Light Intensity", data: chartData.LightIntensity },
            ]}
            type="line"
            width={"100%"}
          />
        </div>
        <div>
          <h3>Nutrient Level</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[{ name: "Nutrient Level", data: chartData.NutrientLevel }]}
            type="line"
            width={"100%"}
          />
        </div>
        <div>
          <h3>Leaf Movement</h3>
          <ReactApexChart
            // @ts-ignore
            options={chartOptions}
            series={[{ name: "Leaf Movement", data: chartData.LeafMovement }]}
            type="line"
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
