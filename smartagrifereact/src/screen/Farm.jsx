import React, { useEffect, useState } from "react";

import "./css/Farm.css";

import FarmList from "../component/FarmOverview/FarmList";
import FarmForm from "../component/FarmOverview/FarmForm";
import FarmDetail from "../component/FarmOverview/FarmDetail";
import Sidebar from "../component/Sidebar/SideBar";

const emptyFarm = {
  id: null,
  name: "",
  area: "",
  polygon: null,
  latitude: "",
  longitude: "",
  address: "",
  status: true,
  userId: null,
};

export const Farm = ({
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
  logOutFunction,
}) => {
  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingFarm, setEditingFarm] = useState(null);

  const [selectedFarm, setSelectedFarm] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

  const [inputForm, setInputForm] = useState(emptyFarm);

  /*
    |--------------------------------------------------------------------------
    | GET ALL FARM
    |--------------------------------------------------------------------------
    */

  const loadFarms = async () => {
    try {
      setLoading(true);

      setError("");

      if (!getFarms) {
        setFarms([]);
        return;
      }

      const result = await getFarms();

      /*
       * Antisipasi beberapa bentuk response.
       */

      const data = result?.data || result?.farms || result || [];

      setFarms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil data farm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  /*
    |--------------------------------------------------------------------------
    | OPEN ADD
    |--------------------------------------------------------------------------
    */

  const handleAdd = () => {
    setEditingFarm(null);

    setInputForm({
      ...emptyFarm,
    });

    setShowForm(true);
  };

  /*
    |--------------------------------------------------------------------------
    | OPEN EDIT
    |--------------------------------------------------------------------------
    */

  const handleEdit = (farm) => {
    setEditingFarm(farm);

    setInputForm({
      ...farm,

      polygon: farm.polygon || null,
    });

    setShowForm(true);

    setSelectedFarm(null);
  };

  /*
    |--------------------------------------------------------------------------
    | CLOSE FORM
    |--------------------------------------------------------------------------
    */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    setEditingFarm(null);

    setInputForm({
      ...emptyFarm,
    });
  };

  /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      const payload = {
        name: inputForm.name,

        area: inputForm.area === "" ? null : Number(inputForm.area),

        polygon: inputForm.polygon || null,

        latitude: inputForm.latitude === "" ? null : Number(inputForm.latitude),

        longitude:
          inputForm.longitude === "" ? null : Number(inputForm.longitude),

        address: inputForm.address || "",

        status: inputForm.status !== false,
      };

      /*
       * EDIT
       */

      if (editingFarm) {
        if (!updateFarm) {
          throw new Error("updateFarm belum dihubungkan.");
        }

        await updateFarm(editingFarm.id, payload);
      }

      /*
       * ADD
       */
      else {
        if (!createFarm) {
          throw new Error("createFarm belum dihubungkan.");
        }

        await createFarm(payload);
      }

      await loadFarms();

      handleCloseForm();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal menyimpan farm.");
    } finally {
      setSaving(false);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

  const handleDelete = async (farm) => {
    const confirmed = window.confirm(`Hapus farm "${farm.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      if (!deleteFarm) {
        throw new Error("deleteFarm belum dihubungkan.");
      }

      await deleteFarm(farm.id);

      if (selectedFarm && selectedFarm.id === farm.id) {
        setSelectedFarm(null);
      }

      await loadFarms();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal menghapus farm.");
    }
  };

  /*
    |--------------------------------------------------------------------------
    | DETAIL
    |--------------------------------------------------------------------------
    */

  const handleView = (farm) => {
    setSelectedFarm(farm);
  };

  /*
    |--------------------------------------------------------------------------
    | CLOSE DETAIL
    |--------------------------------------------------------------------------
    */

  const handleCloseDetail = () => {
    setSelectedFarm(null);
  };

//   return (
//     <>
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         logOutFunction={logOutFunction}
//       />
//       <div className="farm-page">
//         {/* =====================================================
//                 PAGE HEADER
//             ===================================================== */}

//         <div className="farm-page-header">
//           <div>
//             <div className="farm-page-eyebrow">FARM MANAGEMENT</div>

//             <h1>Farm Overview</h1>

//             <p>
//               Kelola lokasi, lahan, dan informasi farm yang terhubung dengan
//               SmartAgri.
//             </p>
//           </div>

//           <button type="button" className="farm-add-button" onClick={handleAdd}>
//             <span>+</span>
//             Add New Farm
//           </button>
//         </div>

//         {/* =====================================================
//                 ERROR
//             ===================================================== */}

//         {error && (
//           <div className="farm-alert">
//             <span>⚠</span>

//             <div>
//               <strong>Terjadi kesalahan</strong>

//               <p>{error}</p>
//             </div>

//             <button type="button" onClick={() => setError("")}>
//               ×
//             </button>
//           </div>
//         )}

//         {/* =====================================================
//                 STATISTICS
//             ===================================================== */}

//         <div className="farm-stat-grid">
//           <div className="farm-stat-card">
//             <div className="farm-stat-icon">🌱</div>

//             <div>
//               <span>TOTAL FARM</span>

//               <strong>{farms.length}</strong>
//             </div>
//           </div>

//           <div className="farm-stat-card">
//             <div className="farm-stat-icon active">●</div>

//             <div>
//               <span>ACTIVE</span>

//               <strong>
//                 {
//                   farms.filter(
//                     (farm) => farm.status === true || farm.status === "ACTIVE",
//                   ).length
//                 }
//               </strong>
//             </div>
//           </div>

//           <div className="farm-stat-card">
//             <div className="farm-stat-icon area">📐</div>

//             <div>
//               <span>TOTAL AREA</span>

//               <strong>
//                 {farms
//                   .reduce((total, farm) => total + Number(farm.area || 0), 0)
//                   .toLocaleString()}

//                 <small>m²</small>
//               </strong>
//             </div>
//           </div>

//           <div className="farm-stat-card">
//             <div className="farm-stat-icon map">🗺️</div>

//             <div>
//               <span>MAPPED</span>

//               <strong>{farms.filter((farm) => farm.polygon).length}</strong>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//                 FARM LIST
//             ===================================================== */}

//         <FarmList
//           farms={farms}
//           loading={loading}
//           onView={handleView}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onAdd={handleAdd}
//         />

//         {/* =====================================================
//                 FORM MODAL
//             ===================================================== */}

//         {showForm && (
//           <div className="farm-modal-backdrop">
//             <div className="farm-modal">
//               <FarmForm
//                 inputForm={inputForm}
//                 setInputForm={setInputForm}
//                 submitForm={handleSubmit}
//                 editingFarm={editingFarm}
//                 saving={saving}
//                 onClose={handleCloseForm}
//               />
//             </div>
//           </div>
//         )}

//         {/* =====================================================
//                 DETAIL MODAL
//             ===================================================== */}

//         {selectedFarm && (
//           <div className="farm-modal-backdrop">
//             <div className="farm-detail-modal">
//               <FarmDetail
//                 farm={selectedFarm}
//                 onClose={handleCloseDetail}
//                 onEdit={handleEdit}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
  return (
    <div className="farm-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="farm-main">
        <div className="farm-page">
          {/* =====================================================
            PAGE HEADER
        ===================================================== */}

          <div className="farm-page-header">
            <div>
              <div className="farm-page-eyebrow">FARM MANAGEMENT</div>

              <h1>Farm Overview</h1>

              <p>
                Kelola lokasi, lahan, dan informasi farm yang terhubung dengan
                SmartAgri.
              </p>
            </div>

            <button
              type="button"
              className="farm-add-button"
              onClick={handleAdd}
            >
              <span>+</span>
              Add New Farm
            </button>
          </div>

          {/* =====================================================
            ERROR
        ===================================================== */}

          {error && (
            <div className="farm-alert">
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

          {/* =====================================================
            STATISTICS
        ===================================================== */}

          <div className="farm-stat-grid">
            <div className="farm-stat-card">
              <div className="farm-stat-icon">🌱</div>

              <div>
                <span>TOTAL FARM</span>
                <strong>{farms.length}</strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="farm-stat-icon active">●</div>

              <div>
                <span>ACTIVE</span>

                <strong>
                  {
                    farms.filter(
                      (farm) =>
                        farm.status === true || farm.status === "ACTIVE",
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="farm-stat-icon area">📐</div>

              <div>
                <span>TOTAL AREA</span>

                <strong>
                  {farms
                    .reduce((total, farm) => total + Number(farm.area || 0), 0)
                    .toLocaleString()}

                  <small>m²</small>
                </strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="farm-stat-icon map">🗺️</div>

              <div>
                <span>MAPPED</span>

                <strong>{farms.filter((farm) => farm.polygon).length}</strong>
              </div>
            </div>
          </div>

          {/* =====================================================
            FARM LIST
        ===================================================== */}

          <FarmList
            farms={farms}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />

          {/* =====================================================
            FORM MODAL
        ===================================================== */}

          {showForm && (
            <div className="farm-modal-backdrop">
              <div className="farm-modal">
                <FarmForm
                  inputForm={inputForm}
                  setInputForm={setInputForm}
                  submitForm={handleSubmit}
                  editingFarm={editingFarm}
                  saving={saving}
                  onClose={handleCloseForm}
                />
              </div>
            </div>
          )}

          {/* =====================================================
            DETAIL MODAL
        ===================================================== */}

          {selectedFarm && (
            <div className="farm-modal-backdrop">
              <div className="farm-detail-modal">
                <FarmDetail
                  farm={selectedFarm}
                  onClose={handleCloseDetail}
                  onEdit={handleEdit}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Farm;
