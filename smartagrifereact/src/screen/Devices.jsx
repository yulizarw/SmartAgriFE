import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./css/Devices.css";
import Loading from "../component/Loading/Loading";

import Sidebar from "../component/Sidebar/SideBar";

import DeviceHeader from "../component/Devices/DeviceHeader";
import DeviceList from "../component/Devices/DeviceList";
import DeviceForm from "../component/Devices/DeviceForm";
import DeviceDetail from "../component/Devices/DeviceDetail";

// redux
import { listDevice, searchSensorDevice} from "../store/action/deviceAction";

const emptyDevice = {
  deviceCode: "",
  deviceName: "",
  firmWare: "",
  ipAddress: "",
  status: true,
  farmId: "",
  macAddress: "",
  connectionType: "WIFI",
  lastSeen: "",
};

export const Devices = ({
  getDevices,
  createDevice,
  createSensor,
  getSensors,
  getFarms,
  listAllSensor,
  logOutFunction,
}) => {
  const dispatch = useDispatch();
  const [devices, setDevices] = useState([]);

  const [farms, setFarms] = useState([]);

  // const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showDeviceForm, setShowDeviceForm] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const [deviceForm, setDeviceForm] = useState(emptyDevice);

  const userLogin = useSelector((state) => state.userReducers.userLogin);
  const listDevices = useSelector((state) => state.deviceReducers.listDevices);
  const farmList = useSelector((state)=>state.farmReducers.farms)
  const sensorDevices = useSelector((state)=>state.deviceReducers.sensorDevices)
  const listAllSensors = useSelector((state)=> state.deviceReducers.listAllSensors)
  /*
  |--------------------------------------------------------------------------
  | LOAD DEVICES
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (userLogin?.access_token) {
      dispatch(listDevice(userLogin.access_token));
      dispatch(listAllSensor())
    }
  }, [userLogin]);

  // const loadDevices = async () => {
  //   try {
  //     setLoading(true);

  //     setError("");

  //     if (!getDevices) {
  //       setDevices([]);
  //       return;
  //     }

  //     const result = await getDevices();

  //     const data = result?.data || result?.devices || result || [];

  //     setDevices(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     console.error(err);

  //     setError(err?.message || "Gagal mengambil data device.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /*
  |--------------------------------------------------------------------------
  | LOAD FARM
  |--------------------------------------------------------------------------
  */

  // const loadFarms = async () => {
  //   try {
  //     if (!getFarms) {
  //       return;
  //     }

  //     const result = await getFarms();

  //     const data = result?.data || result?.farms || result || [];

  //     setFarms(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     console.error("Load farms error:", err);
  //   }
  // };

  // useEffect(() => {
  //   loadDevices();
  //   loadFarms();
  // }, []);

  /*
  |--------------------------------------------------------------------------
  | ADD DEVICE
  |--------------------------------------------------------------------------
  */

  const handleAddDevice = () => {
    setDeviceForm({
      ...emptyDevice,
    });

    setShowDeviceForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DEVICE FORM
  |--------------------------------------------------------------------------
  */

  const handleCloseDeviceForm = () => {
    if (saving) {
      return;
    }

    setShowDeviceForm(false);

    setDeviceForm({
      ...emptyDevice,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT DEVICE
  |--------------------------------------------------------------------------
  */

  const handleSubmitDevice = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      if (!createDevice) {
        throw new Error("createDevice belum dihubungkan.");
      }

      const payload = {
        deviceCode: deviceForm.deviceCode,

        deviceName: deviceForm.deviceName,

        firmWare: deviceForm.firmWare,

        ipAddress: deviceForm.ipAddress || null,

        status: deviceForm.status !== false,

        farmId: deviceForm.farmId === "" ? null : Number(deviceForm.farmId),

        macAddress: deviceForm.macAddress,

        connectionType: deviceForm.connectionType,

        lastSeen: deviceForm.lastSeen || null,
      };

      await dispatch(createDevice(userLogin.access_token,payload));

      await dispatch(listDevice(userLogin.access_token))
      // await loadDevices();

      handleCloseDeviceForm();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal membuat device.");
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VIEW DEVICE
  |--------------------------------------------------------------------------
  */

  const handleViewDevice = (device) => {
    setSelectedDevice(device);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DETAIL
  |--------------------------------------------------------------------------
  */

  const handleCloseDetail = () => {
    setSelectedDevice(null);
  };

  /*
  |--------------------------------------------------------------------------
  | ADD SENSOR
  |--------------------------------------------------------------------------
  */

  const handleAddSensor = async (payload) => {
    if (!createSensor) {
      throw new Error("createSensor belum dihubungkan.");
    }

    await dispatch(createSensor({
      ...payload,
      deviceId: selectedDevice.id,
      access_token:userLogin.access_token
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */
  console.log(listAllSensors.length)
  const totalDevices = listDevices.length;

  const onlineDevices = listDevices.filter(
    (device) =>
      device.status === true ||
      device.status === "ONLINE" ||
      device.status === "ACTIVE",
  ).length;

  const offlineDevices = totalDevices - onlineDevices;

  return (
    <>
      <Loading />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <div className="devices-page">
        <DeviceHeader
          totalDevices={totalDevices}
          onlineDevices={onlineDevices}
          offlineDevices={offlineDevices}
          onAdd={handleAddDevice}
          listAllSensors={listAllSensors}
      
        />

        {error && (
          <div className="devices-alert">
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

        <DeviceList
          devices={devices}
          listDevices={listDevices}
          farmList = {farmList}
          farms={farms}
          // loading={loading}
          onView={handleViewDevice}
          onAdd={handleAddDevice}
        />

        {showDeviceForm && (
          <div className="device-modal-backdrop">
            <div className="device-modal">
              <DeviceForm
                form={deviceForm}
                setForm={setDeviceForm}
                farmList={farmList}
                saving={saving}
                onSubmit={handleSubmitDevice}
                onClose={handleCloseDeviceForm}
              />
            </div>
          </div>
        )}

        {selectedDevice && (
          <div className="device-modal-backdrop">
            <div className="device-detail-modal">
              <DeviceDetail
                device={selectedDevice}
                farmList={farmList}
                dispatch={dispatch}
                getSensors={searchSensorDevice}
                onAddSensor={handleAddSensor}
                onClose={handleCloseDetail}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
