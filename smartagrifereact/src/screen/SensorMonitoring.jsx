import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../component/Sidebar/SideBar";

import SensorMonitoringHeader from "../component/SensorMonitoring/SensorMonitoringHeader";
import DeviceSummary from "../component/SensorMonitoring/DeviceSummary";
import DeviceList from "../component/SensorMonitoring/DeviceList";
import SensorGrid from "../component/SensorMonitoring/SensorGrid";
import SensorReadingTable from "../component/SensorMonitoring/SensorReadingTable";

import "./css/SensorMonitoring.css";
import Loading from "../component/Loading/Loading";

export const SensorMonitoring = ({
  getDevices,
  getDevice,
  collectDevice,
  logOutFunction,
  listDevice,
  getAllReading,
}) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [sensorReadings, setSensorReadings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);

  const [error, setError] = useState("");
  // store
  const listDevices = useSelector((state) => state.deviceReducers.listDevices);
  const allReadings = useSelector((state) => state.deviceReducers.allReadings);
  console.log(allReadings, "asd");
  /*
  |--------------------------------------------------------------------------
  | GET DEVICES
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    // pertama kali load
    dispatch(listDevice());
    dispatch(getAllReading());
    // refresh setiap 5 detik
    const interval = setInterval(() => {
      dispatch(listDevice());
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDevice || !collectDevice) {
      return;
    }

    let cancelled = false;

    const fetchReadings = async () => {
      try {
        const result = await collectDevice(selectedDevice.id);

        if (cancelled) {
          return;
        }

        const realtime = result?.realtime || result?.data || {};

        const readings = realtime?.readings || result?.database?.readings || [];

        setSensorReadings(Array.isArray(readings) ? readings : []);
      } catch (err) {
        if (!cancelled) {
          console.error("Gagal mengambil sensor readings:", err);
        }
      }
    };

    // langsung ambil ketika device dipilih
    fetchReadings();

    // refresh setiap 2.5 detik
    const interval = setInterval(fetchReadings, 2500);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedDevice?.id, collectDevice]);

  const loadDevices = async () => {
    try {
      //   setLoading(true);
      //   setError("");
      //   if (!getDevices) {
      //     setDevices([]);
      //     return;
      //   }
      //   const result = await getDevices();
      //   const data = result?.data || result?.devices || result || [];
      //   setDevices(Array.isArray(data) ? data : []);
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

  // const handleSelectDevice = async (device) => {
  //   try {
  //     setError("");

  //     const isOnline =
  //       device.status === true ||
  //       device.status === "ONLINE" ||
  //       device.status === "ACTIVE";

  //     if (!isOnline) {
  //       setSelectedDevice(null);
  //       setSensorReadings([]);
  //       return;
  //     }

  //     setSelectedDevice(device);

  //     if (!getDevice) {
  //       return;
  //     }

  //     const deviceCode = device.deviceCode;

  //     const result = await getDevice(deviceCode);

  //     const data = result?.data || result;

  //     if (data) {
  //       const dataIsOnline =
  //         data.status === true ||
  //         data.status === "ONLINE" ||
  //         data.status === "ACTIVE";

  //       if (dataIsOnline) {
  //         setSelectedDevice(data);
  //       } else {
  //         setSelectedDevice(null);
  //         setSensorReadings([]);
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);

  //     setSelectedDevice(null);
  //     setSensorReadings([]);

  //     setError(err?.message || "Gagal mengambil informasi device.");
  //   }
  // };
  const handleSelectDevice = async (device) => {
    try {
      setError("");

      // PENTING:
      // hapus data sensor device sebelumnya
      setSensorReadings([]);

      const isOnline =
        device.status === true ||
        device.status === "ONLINE" ||
        device.status === "ACTIVE";

      if (!isOnline) {
        setSelectedDevice(null);
        return;
      }

      setSelectedDevice(device);

      if (!getDevice) {
        return;
      }

      const deviceCode = device.deviceCode;

      const result = await getDevice(deviceCode);

      const data = result?.data || result;

      if (data) {
        const dataIsOnline =
          data.status === true ||
          data.status === "ONLINE" ||
          data.status === "ACTIVE";

        if (dataIsOnline) {
          setSelectedDevice(data);
        } else {
          setSelectedDevice(null);
          setSensorReadings([]);
        }
      }
    } catch (err) {
      console.error(err);

      setSelectedDevice(null);
      setSensorReadings([]);

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

      // await loadDevices();
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
    const total = listDevices.length;

    const online = listDevices.filter(
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
  }, [listDevices]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    const currentDevice = listDevices.find(
      (device) =>
        device.id === selectedDevice.id ||
        device.deviceCode === selectedDevice.deviceCode,
    );

    // Device sudah tidak ada di list
    if (!currentDevice) {
      setSelectedDevice(null);
      setSensorReadings([]);
      return;
    }

    const isOnline =
      currentDevice.status === true ||
      currentDevice.status === "ONLINE" ||
      currentDevice.status === "ACTIVE";

    // Device yang sedang dipilih tiba-tiba OFFLINE
    if (!isOnline) {
      setSelectedDevice(null);
      setSensorReadings([]);
      setError("");
    }
  }, [listDevices, selectedDevice]);

  return (
    <>
      <Loading />
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
            devices={listDevices}
            loading={loading}
            selectedDevice={selectedDevice}
            onSelect={handleSelectDevice}
          />

          <div className="sensor-monitoring-main">
            <SensorGrid device={selectedDevice} readings={allReadings} />

            <SensorReadingTable readings={allReadings} />
          </div>
        </div>
      </div>
    </>
  );
};
