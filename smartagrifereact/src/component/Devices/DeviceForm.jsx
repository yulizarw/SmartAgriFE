import React from "react";

import "./css/DeviceForm.css";

const DeviceForm = ({ form, setForm, farms, saving, onSubmit, onClose }) => {
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="device-form" onSubmit={onSubmit}>
      <div className="device-form-header">
        <div>
          <span>DEVICE REGISTRATION</span>

          <h2>Add New Device</h2>
        </div>

        <button type="button" onClick={onClose} disabled={saving}>
          ×
        </button>
      </div>

      <div className="device-form-body">
        <div className="device-form-grid">
          <div className="device-field">
            <label>Device Code</label>

            <input
              type="text"
              value={form.deviceCode}
              onChange={(e) => updateField("deviceCode", e.target.value)}
              placeholder="ESP32-001"
              required
            />
          </div>

          <div className="device-field">
            <label>Device Name</label>

            <input
              type="text"
              value={form.deviceName}
              onChange={(e) => updateField("deviceName", e.target.value)}
              placeholder="ESP32 Farm 01"
              required
            />
          </div>

          <div className="device-field">
            <label>Firmware</label>

            <input
              type="text"
              value={form.firmWare}
              onChange={(e) => updateField("firmWare", e.target.value)}
              placeholder="v1.0.0"
            />
          </div>

          <div className="device-field">
            <label>MAC Address</label>

            <input
              type="text"
              value={form.macAddress}
              onChange={(e) => updateField("macAddress", e.target.value)}
              placeholder="AA:BB:CC:DD:EE:FF"
            />
          </div>

          <div className="device-field">
            <label>IP Address</label>

            <input
              type="text"
              value={form.ipAddress}
              onChange={(e) => updateField("ipAddress", e.target.value)}
              placeholder="192.168.1.100"
            />
          </div>

          <div className="device-field">
            <label>Connection Type</label>

            <select
              value={form.connectionType}
              onChange={(e) => updateField("connectionType", e.target.value)}
            >
              <option value="WIFI">WiFi</option>

              <option value="ETHERNET">Ethernet</option>

              <option value="MQTT">MQTT</option>

              <option value="LORA">LoRa</option>
            </select>
          </div>

          <div className="device-field">
            <label>Farm</label>

            <select
              value={form.farmId}
              onChange={(e) => updateField("farmId", e.target.value)}
              required
            >
              <option value="">Select Farm</option>

              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="device-field">
            <label>Status</label>

            <select
              value={form.status ? "true" : "false"}
              onChange={(e) => updateField("status", e.target.value === "true")}
            >
              <option value="true">Active</option>

              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="device-api-info">
          <span>🔐</span>

          <div>
            <strong>API Key</strong>

            <p>
              API Key dibuat otomatis oleh sistem dan tidak perlu diisi secara
              manual.
            </p>
          </div>
        </div>
      </div>

      <div className="device-form-footer">
        <button type="button" onClick={onClose} disabled={saving}>
          Cancel
        </button>

        <button type="submit" className="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Device"}
        </button>
      </div>
    </form>
  );
};

export default DeviceForm;
