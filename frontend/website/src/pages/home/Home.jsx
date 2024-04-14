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
    const ws = new WebSocket("ws://vscode.samarthasthan.com:8000/ws");

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
  const calculateEmotionalState = () => {
    const {
      SoilMoisture,
      LightIntensity,
      Temperature,
      Humidity,
      NutrientLevel,
      LeafMovement,
    } = chartData;

    // Define thresholds
    const thresholds = {
      SoilMoisture: {
        healthy: [30, 70],
        underwatered: [0, 30],
        overwatered: [70, 100],
      },
      LightIntensity: {
        healthy: [400, 800],
        tooLittleSunlight: [0, 400],
        tooMuchSunlight: [800, 1200],
      },
      Temperature: { healthy: [20, 30], tooCold: [0, 20], tooHot: [30, 40] },
      Humidity: { healthy: [50, 70], tooDry: [0, 50], tooHumid: [70, 100] },
      NutrientLevel: {
        healthy: [2.5, 3.5],
        nutrientDeficiency: [0, 2.5],
        nutrientExcess: [3.5, 5],
      },
      LeafMovement: { low: [0, 1], moderate: [1, 2], high: [2, 3] },
    };

    // Check where each factor falls within the thresholds
    const emotionalState = [];
    if (
      SoilMoisture[SoilMoisture.length - 1] <
      thresholds.SoilMoisture.underwatered[1]
    ) {
      emotionalState.push("Underwatered");
    } else if (
      SoilMoisture[SoilMoisture.length - 1] >
      thresholds.SoilMoisture.overwatered[0]
    ) {
      emotionalState.push("Overwatered");
    }
    if (
      LightIntensity[LightIntensity.length - 1] <
      thresholds.LightIntensity.tooLittleSunlight[1]
    ) {
      emotionalState.push("Too little sunlight");
    } else if (
      LightIntensity[LightIntensity.length - 1] >
      thresholds.LightIntensity.tooMuchSunlight[0]
    ) {
      emotionalState.push("Too much sunlight");
    }
    if (
      Temperature[Temperature.length - 1] < thresholds.Temperature.tooCold[1]
    ) {
      emotionalState.push("Too cold");
    } else if (
      Temperature[Temperature.length - 1] > thresholds.Temperature.tooHot[0]
    ) {
      emotionalState.push("Too hot");
    }
    if (Humidity[Humidity.length - 1] < thresholds.Humidity.tooDry[1]) {
      emotionalState.push("Too dry");
    } else if (
      Humidity[Humidity.length - 1] > thresholds.Humidity.tooHumid[0]
    ) {
      emotionalState.push("Too humid");
    }
    if (
      NutrientLevel[NutrientLevel.length - 1] <
      thresholds.NutrientLevel.nutrientDeficiency[1]
    ) {
      emotionalState.push("Nutrient deficiency");
    } else if (
      NutrientLevel[NutrientLevel.length - 1] >
      thresholds.NutrientLevel.nutrientExcess[0]
    ) {
      emotionalState.push("Nutrient excess");
    }
    if (
      LeafMovement[LeafMovement.length - 1] <
        thresholds.LeafMovement.moderate[0] ||
      LeafMovement[LeafMovement.length - 1] >
        thresholds.LeafMovement.moderate[1]
    ) {
      emotionalState.push("Unhealthy");
    } else {
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
