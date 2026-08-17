import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../component/Sidebar/SideBar";

import CropHeader from "../component/Crop/CropHeader";
import CropList from "../component/Crop/CropList";
import CropForm from "../component/Crop/CropForm";
import CropDetail from "../component/Crop/CropDetail";

import "./css/Crop.css";
import "./css/loading.css";

// loading
import Lottie from "react-lottie";
import * as loaderData from "../asset/lottieLego.json";

// redux
import {
  cropLists,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../store/action/cropAction";

const emptyCrop = {
  cropName: "",
  variety: "",
  plantingDate: "",
  harvestDate: "",
  targetMoisture: "",
  targetNDVI: "",
  targetTemperature: "",
  status: "Growing",
  farmId: "",
};

export const Crop = ({
  getCrops,
  getFarms,
  // createCrop,
  // updateCrop,
  // deleteCrop,
  logOutFunction,
}) => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCropForm, setShowCropForm] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState(null);

  const [cropForm, setCropForm] = useState(emptyCrop);

  const [editingCrop, setEditingCrop] = useState(null);

  // store
  const cropHome = useSelector((state) => state.cropReducers.cropHome);
  const userLogin = useSelector((state) => state.userReducers.userLogin);
  const listCrop = useSelector((state) => state.cropReducers.listCrop);
  const farmList = useSelector((state) => state.farmReducers.farms);

  // loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (userLogin?.access_token) {
      dispatch(cropLists(userLogin.access_token));
    }
  }, [userLogin?.access_token, dispatch]);

  // loading
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD CROPS
  |--------------------------------------------------------------------------
  */

  // const loadCrops = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     if (!listCrop) {
  //       setCrops([]);
  //       return;
  //     }

  //     // const result = await getCrops();

  //     const data = listCrop?.data || listCrop?.crops || [];
  //     setCrops(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     console.error(err);

  //     setError(err?.message || "Gagal mengambil data crop.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /*
  |--------------------------------------------------------------------------
  | LOAD FARMS
  |--------------------------------------------------------------------------
  */

  const loadFarms = async () => {
    try {
      if (!getFarms) {
        setFarms([]);
        return;
      }

      // const result = await getFarms();

      const data = listCrop?.data || listCrop?.farms || [];

      setFarms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load farms error:", err);
    }
  };

  // useEffect(() => {
  //   loadCrops();
  //   loadFarms();
  // }, []);

  /*
  |--------------------------------------------------------------------------
  | ADD CROP
  |--------------------------------------------------------------------------
  */

  const handleAddCrop = () => {
    setEditingCrop(null);

    setCropForm({
      ...emptyCrop,
    });

    setShowCropForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT CROP
  |--------------------------------------------------------------------------
  */

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);

    setCropForm({
      cropName: crop.cropName || "",

      variety: crop.variety || "",

      plantingDate: crop.plantingDate ? crop.plantingDate.slice(0, 10) : "",

      harvestDate: crop.harvestDate ? crop.harvestDate.slice(0, 10) : "",

      targetMoisture: crop.targetMoisture ?? "",

      targetNDVI: crop.targetNDVI ?? "",

      targetTemperature: crop.targetTemperature ?? "",

      status: crop.status || "Growing",

      farmId: crop.farmId ?? "",
    });

    setShowCropForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE FORM
  |--------------------------------------------------------------------------
  */

  const handleCloseCropForm = () => {
    if (saving) {
      return;
    }

    setShowCropForm(false);

    setEditingCrop(null);

    setCropForm({
      ...emptyCrop,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT CROP
  |--------------------------------------------------------------------------
  */

  const handleSubmitCrop = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!cropForm.farmId) {
        throw new Error("Farm wajib dipilih.");
      }

      const payload = {
        cropName: cropForm.cropName,
        variety: cropForm.variety,
        plantingDate: cropForm.plantingDate,
        harvestDate: cropForm.harvestDate || null,
        targetMoisture: Number(cropForm.targetMoisture),
        targetNDVI: Number(cropForm.targetNDVI),
        targetTemperature: Number(cropForm.targetTemperature),
        status: cropForm.status,
        farmId: Number(cropForm.farmId),
      };

      // =====================================================
      // CREATE
      // =====================================================

      if (!editingCrop) {
        await dispatch(createCrop(payload, userLogin.access_token));
      }

      // =====================================================
      // UPDATE
      // =====================================================
      else {
        await dispatch(
          updateCrop(editingCrop.id, payload, userLogin.access_token),
        );
      }

      // =====================================================
      // LOAD ULANG DATA TERBARU
      // =====================================================

      await dispatch(cropLists(userLogin.access_token));

      // =====================================================
      // TUTUP FORM
      // =====================================================

      handleCloseCropForm();
    } catch (err) {
      console.error("SUBMIT CROP ERROR:", err);

      setError(
        err?.response?.data?.message || err?.message || "Gagal menyimpan crop.",
      );
    } finally {
      setSaving(false);
    }
  };
  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  // const handleDeleteCrop = async (crop) => {
  //   const confirmed = window.confirm(`Hapus tanaman "${crop.cropName}"?`);

  //   if (!confirmed) {
  //     return;
  //   }

  //   try {
  //     setError("");

  //     if (!deleteCrop) {
  //       throw new Error("deleteCrop belum dihubungkan.");
  //     }else{
  //       await dispatch(deleteCrop(crop.id,userLogin.access_token))
  //     }
  //     setSelectedCrop(null);

  //     await dispatch(cropLists(userLogin.access_token));
  //   } catch (err) {
  //     console.error(err);
  //     setError(err?.message || "Gagal menghapus crop.");
  //   }
  // };
  const handleDeleteCrop = async (crop) => {
    const confirmed = window.confirm(`Hapus tanaman "${crop.cropName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSaving(true);

      // 1. Tunggu DELETE selesai
      await dispatch(deleteCrop(crop.id, userLogin.access_token));

      // 2. Baru ambil data terbaru
      await dispatch(cropLists(userLogin.access_token));

      // 3. Tutup detail
      setSelectedCrop(null);
    } catch (err) {
      console.error("DELETE CROP ERROR:", err);

      setError(
        err?.response?.data?.message || err?.message || "Gagal menghapus crop.",
      );
    } finally {
      setSaving(false);
    }
  };
  /*
  |--------------------------------------------------------------------------
  | FARM NAME
  |--------------------------------------------------------------------------
  */

  const getFarmName = (farmId) => {
    const farm = farms.find((item) => Number(item.id) === Number(farmId));

    return farm?.name || "Farm tidak ditemukan";
  };

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalCrops = listCrop.length;

  const activeCrops = listCrop.filter(
    (crop) => crop.status === "Growing" || crop.status === "Active",
  ).length;

  const harvestedCrops = listCrop.filter(
    (crop) => crop.status === "Harvested",
  ).length;

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <Lottie options={defaultOptions} height={180} width={180} />
        </div>
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="crop-page">
        <CropHeader
          totalCrops={totalCrops}
          activeCrops={activeCrops}
          harvestedCrops={harvestedCrops}
          onAdd={handleAddCrop}
        />

        {error && (
          <div className="crop-alert">
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

        <CropList
          crops={crops}
          listCrop={listCrop}
          farms={farms}
          loading={loading}
          onAdd={handleAddCrop}
          onView={setSelectedCrop}
          onEdit={handleEditCrop}
        />

        {/* ADD / EDIT CROP */}

        {showCropForm && (
          <div className="crop-modal-backdrop">
            <div className="crop-modal">
              <CropForm
                form={cropForm}
                setForm={setCropForm}
                farmList={farmList}
                saving={saving}
                editingCrop={editingCrop}
                onSubmit={handleSubmitCrop}
                onClose={handleCloseCropForm}
              />
            </div>
          </div>
        )}

        {/* DETAIL */}

        {selectedCrop && (
          <div className="crop-modal-backdrop">
            <div className="crop-detail-modal">
              <CropDetail
                crop={selectedCrop}
                farmList={farmList}
                farmName={getFarmName(selectedCrop.farmId)}
                onEdit={() => {
                  setSelectedCrop(null);

                  handleEditCrop(selectedCrop);
                }}
                onDelete={() => handleDeleteCrop(selectedCrop)}
                onClose={() => setSelectedCrop(null)}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};
