import React, { useState, useEffect } from "react";

function AdjustValuesPage() {
  const [values, setValues] = useState({
    Temperature: 25,
    SoilMoisture: 50,
    LightIntensity: 500,
    Humidity: 60,
    NutrientLevel: 3,
    LeafMovement: 0,
  });

  const handleSliderChange = (field) => (event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: parseFloat(event.target.value),
    }));
  };

  useEffect(() => {
    // Send updated values to the WebSocket server every second
    const interval = setInterval(() => {
      const ws = new WebSocket("ws://vscode.samarthasthan.com:1082/ws");
      ws.onopen = () => {
        ws.send(JSON.stringify(values));
        ws.close();
      };
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup function to clear interval when component unmounts
    };
  }, [values]); // Only re-run effect if 'values' state changes

  return (
    <div>
      <h4>Adjust Object Values</h4>
      <div>
        <label>Temperature: {values.Temperature}</label>
        <input
          type="range"
          min={0}
          max={40}
          step={0.1}
          value={values.Temperature}
          onChange={handleSliderChange("Temperature")}
        />
      </div>
      <div>
        <label>Soil Moisture: {values.SoilMoisture}</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={values.SoilMoisture}
          onChange={handleSliderChange("SoilMoisture")}
        />
      </div>
      <div>
        <label>Light Intensity: {values.LightIntensity}</label>
        <input
          type="range"
          min={0}
          max={1200}
          step={1}
          value={values.LightIntensity}
          onChange={handleSliderChange("LightIntensity")}
        />
      </div>
      <div>
        <label>Humidity: {values.Humidity}</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={values.Humidity}
          onChange={handleSliderChange("Humidity")}
        />
      </div>
      <div>
        <label>Nutrient Level: {values.NutrientLevel}</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={values.NutrientLevel}
          onChange={handleSliderChange("NutrientLevel")}
        />
      </div>
      <div>
        <label>Leaf Movement: {values.LeafMovement}</label>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={values.LeafMovement}
          onChange={handleSliderChange("LeafMovement")}
        />
      </div>
    </div>
  );
}

export default AdjustValuesPage;
