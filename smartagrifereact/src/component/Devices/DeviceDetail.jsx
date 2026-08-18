import React, { useEffect, useState } from "react";

import "./css/DeviceDetail.css";

import SensorList from "./SensorList";
import SensorForm from "./SensorForm";

const DeviceDetail = ({ device, farmList, getSensors, onAddSensor, onClose, dispatch }) => {
  const [sensors, setSensors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showSensorForm, setShowSensorForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const farm = farmList.find((item) => Number(item.id) === Number(device.farmId));

  /*
  |--------------------------------------------------------------------------
  | LOAD SENSOR
  |--------------------------------------------------------------------------
  */

  const loadSensors = async () => {
    try {
      setLoading(true);

      if (!getSensors) {
        setSensors([]);

        return;
      }
      console.log(device.id)
      const result = await dispatch(getSensors(device.id));
      const data = result?.data || result?.sensors || result || [];
      setSensors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil sensor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, [device.id]);

  /*
  |--------------------------------------------------------------------------
  | ADD SENSOR
  |--------------------------------------------------------------------------
  */

  const handleSubmitSensor = async (form) => {
    try {
      setSaving(true);

      setError("");

      await onAddSensor(form);

      await loadSensors();

      setShowSensorForm(false);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal menambahkan sensor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="device-detail">
      <div className="device-detail-header">
        <div>
          <span>DEVICE MANAGEMENT</span>

          <h2>{device.deviceName || device.deviceCode}</h2>

          <small>{device.deviceCode}</small>
        </div>

        <button type="button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="device-detail-body">
        {/* DEVICE INFORMATION */}

        <div className="device-info-section">
          <div className="device-info-title">DEVICE INFORMATION</div>

          <div className="device-info-grid">
            <div>
              <span>Device Code</span>

              <strong>{device.deviceCode}</strong>
            </div>

            <div>
              <span>Farm</span>

              <strong>{farm?.name || "No Farm"}</strong>
            </div>

            <div>
              <span>Firmware</span>

              <strong>{device.firmWare || "-"}</strong>
            </div>

            <div>
              <span>MAC Address</span>

              <strong>{device.macAddress || "-"}</strong>
            </div>

            <div>
              <span>IP Address</span>

              <strong>{device.ipAddress || "-"}</strong>
            </div>

            <div>
              <span>Connection</span>

              <strong>{device.connectionType || "-"}</strong>
            </div>
          </div>
        </div>

        {/* SENSOR */}

        <div className="sensor-section">
          <div className="sensor-section-header">
            <div>
              <span>CONNECTED IOT</span>

              <h3>Sensors</h3>
            </div>

            <button type="button" onClick={() => setShowSensorForm(true)}>
              + Add IoT Sensor
            </button>
          </div>

          {error && <div className="sensor-error">{error}</div>}

          <SensorList sensors={sensors} loading={loading} />
        </div>
      </div>

      {/* SENSOR FORM */}

      {showSensorForm && (
        <div className="sensor-form-wrapper">
          <SensorForm
            saving={saving}
            onSubmit={handleSubmitSensor}
            onClose={() => setShowSensorForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DeviceDetail;
