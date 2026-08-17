import React, { useState } from "react";

import "./css/SensorForm.css";

const SensorForm = ({ saving, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    sensorType: "",

    pin: "",

    unit: "",

    location: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
  };

  return (
    <form className="sensor-form" onSubmit={handleSubmit}>
      <div className="sensor-form-header">
        <div>
          <span>SENSOR REGISTRATION</span>

          <h3>Add IoT Sensor</h3>
        </div>

        <button type="button" onClick={onClose} disabled={saving}>
          ×
        </button>
      </div>

      <div className="sensor-form-grid">
        <div className="sensor-field">
          <label>Sensor Type</label>

          <select
            value={form.sensorType}
            onChange={(e) => updateField("sensorType", e.target.value)}
            required
          >
            <option value="">Select Sensor</option>

            <option value="SOIL_MOISTURE">Soil Moisture</option>

            <option value="TEMPERATURE">Temperature</option>

            <option value="HUMIDITY">Humidity</option>

            <option value="LIGHT">Light</option>

            <option value="PH">pH</option>

            <option value="RAINFALL">Rainfall</option>
          </select>
        </div>

        <div className="sensor-field">
          <label>Pin</label>

          <input
            type="text"
            value={form.pin}
            onChange={(e) => updateField("pin", e.target.value)}
            placeholder="GPIO 34"
            required
          />
        </div>

        <div className="sensor-field">
          <label>Unit</label>

          <input
            type="text"
            value={form.unit}
            onChange={(e) => updateField("unit", e.target.value)}
            placeholder="%"
          />
        </div>

        <div className="sensor-field">
          <label>Location</label>

          <input
            type="text"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Farm A - Zone 1"
          />
        </div>
      </div>

      <div className="sensor-form-footer">
        <button type="button" onClick={onClose} disabled={saving}>
          Cancel
        </button>

        <button type="submit" className="primary" disabled={saving}>
          {saving ? "Saving..." : "Add Sensor"}
        </button>
      </div>
    </form>
  );
};

export default SensorForm;
