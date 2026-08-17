import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import SensorMonitoringHeader from "../component/SensorMonitoring/SensorMonitoringHeader";
import DeviceSummary from "../component/SensorMonitoring/DeviceSummary";
import DeviceList from "../component/SensorMonitoring/DeviceList";
import SensorGrid from "../component/SensorMonitoring/SensorGrid";
import SensorReadingTable from "../component/SensorMonitoring/SensorReadingTable";

import "./css/SensorMonitoring.css";

export const SensorMonitoring = ({
  getDevices,
  getDevice,
  collectDevice,
  logOutFunction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [sensorReadings, setSensorReadings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GET DEVICES
  |--------------------------------------------------------------------------
  */

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError("");

      if (!getDevices) {
        setDevices([]);
        return;
      }

      const result = await getDevices();

      const data = result?.data || result?.devices || result || [];

      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil data device.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DEVICE SELECT
  |--------------------------------------------------------------------------
  */

  const handleSelectDevice = async (device) => {
    try {
      setError("");

      setSelectedDevice(device);

      if (!getDevice) {
        return;
      }

      const deviceCode = device.deviceCode;

      const result = await getDevice(deviceCode);

      const data = result?.data || result;

      if (data) {
        setSelectedDevice(data);
      }
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil informasi device.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COLLECT REALTIME
  |--------------------------------------------------------------------------
  */

  const handleCollect = async () => {
    if (!selectedDevice) {
      return;
    }

    try {
      setCollecting(true);
      setError("");

      if (!collectDevice) {
        throw new Error("collectDevice belum dihubungkan.");
      }

      const result = await collectDevice(selectedDevice.id);

      const realtime = result?.realtime || result?.data || {};

      const readings = realtime?.readings || result?.database?.readings || [];

      setSensorReadings(Array.isArray(readings) ? readings : []);

      await loadDevices();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil data sensor.");
    } finally {
      setCollecting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const total = devices.length;

    const online = devices.filter(
      (device) =>
        device.status === true ||
        device.status === "ONLINE" ||
        device.status === "ACTIVE",
    ).length;

    const offline = total - online;

    return {
      total,
      online,
      offline,
    };
  }, [devices]);

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <div className="sensor-monitoring-page">
        <SensorMonitoringHeader
          selectedDevice={selectedDevice}
          collecting={collecting}
          onCollect={handleCollect}
        />

        {error && (
          <div className="sensor-monitoring-alert">
            <span>⚠</span>

            <div>
              <strong>Terjadi kesalahan</strong>

              <p>{error}</p>
            </div>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        <DeviceSummary
          total={statistics.total}
          online={statistics.online}
          offline={statistics.offline}
        />

        <div className="sensor-monitoring-layout">
          <DeviceList
            devices={devices}
            loading={loading}
            selectedDevice={selectedDevice}
            onSelect={handleSelectDevice}
          />

          <div className="sensor-monitoring-main">
            <SensorGrid device={selectedDevice} readings={sensorReadings} />

            <SensorReadingTable readings={sensorReadings} />
          </div>
        </div>
      </div>
    </>
  );
};


