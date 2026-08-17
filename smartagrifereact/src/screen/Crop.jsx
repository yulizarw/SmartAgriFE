import React, { useEffect, useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import CropHeader from "../component/Crop/CropHeader";
import CropList from "../component/Crop/CropList";
import CropForm from "../component/Crop/CropForm";
import CropDetail from "../component/Crop/CropDetail";

import "./css/Crop.css";

const emptyCrop = {
  cropName: "",
  variety: "",
  plantingDate: "",
  harvestDate: "",
  targetMoisture: "",
  targetNDVI: "",
  targetTemperature: "",
  status: "GROWING",
  farmId: "",
};

export const Crop = ({
  getCrops,
  getFarms,
  createCrop,
  updateCrop,
  deleteCrop,
  logOutFunction,
}) => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCropForm, setShowCropForm] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState(null);

  const [cropForm, setCropForm] = useState(emptyCrop);

  const [editingCrop, setEditingCrop] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD CROPS
  |--------------------------------------------------------------------------
  */

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError("");

      if (!getCrops) {
        setCrops([]);
        return;
      }

      const result = await getCrops();

      const data = result?.data || result?.crops || result || [];

      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil data crop.");
    } finally {
      setLoading(false);
    }
  };

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

      const result = await getFarms();

      const data = result?.data || result?.farms || result || [];

      setFarms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load farms error:", err);
    }
  };

  useEffect(() => {
    loadCrops();
    loadFarms();
  }, []);

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

      status: crop.status || "GROWING",

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

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      if (!editingCrop) {
        if (!createCrop) {
          throw new Error("createCrop belum dihubungkan.");
        }

        await createCrop(payload);
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */
      else {
        if (!updateCrop) {
          throw new Error("updateCrop belum dihubungkan.");
        }

        await updateCrop(editingCrop.id, payload);
      }

      await loadCrops();

      handleCloseCropForm();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal menyimpan crop.");
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDeleteCrop = async (crop) => {
    const confirmed = window.confirm(`Hapus tanaman "${crop.cropName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      if (!deleteCrop) {
        throw new Error("deleteCrop belum dihubungkan.");
      }

      await deleteCrop(crop.id);

      setSelectedCrop(null);

      await loadCrops();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal menghapus crop.");
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

  const totalCrops = crops.length;

  const activeCrops = crops.filter(
    (crop) => crop.status === "GROWING" || crop.status === "ACTIVE",
  ).length;

  const harvestedCrops = crops.filter(
    (crop) => crop.status === "HARVESTED",
  ).length;

  return (
    <>
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
                farms={farms}
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
