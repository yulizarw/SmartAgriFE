import React, { useEffect, useState } from "react";

import "./css/Farm.css";
import "./css/loading.css";
// redux
import {
  fetchFarms,
  addFarm,
  updateFarm,
  deleteFarm,
} from "../store/action/farmAction";

import FarmList from "../component/FarmOverview/FarmList";
import FarmForm from "../component/FarmOverview/FarmForm";
import FarmDetail from "../component/FarmOverview/FarmDetail";
import Sidebar from "../component/Sidebar/SideBar";
import { useSelector, useDispatch } from "react-redux";

// loading
import Lottie from "react-lottie";
import * as loaderData from "../asset/lottieLego.json";

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
  // updateFarm,
  // deleteFarm,
  logOutFunction,
}) => {
  const dispatch = useDispatch();
  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingFarm, setEditingFarm] = useState(null);

  const [selectedFarm, setSelectedFarm] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // store
  const userLogin = useSelector((state) => state.userReducers.userLogin);
  const farmList = useSelector((state) => state.farmReducers.farms);

  // useEffect(() => {
  //     if (userLogin?.access_token) {
  //       dispatch(cropLists(userLogin.access_token));
  //     }
  //   }, [userLogin?.access_token, dispatch]);

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

      if (!farms) {
        setFarms([]);
        return;
      }

      const result = farmList;

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

  // useEffect(() => {
  //   loadFarms();
  // }, []);
  // =========================================================
  // LOADING
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  // =========================================================
  // LOTTIE
  // =========================================================

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
        const result = await dispatch(
          updateFarm(editingFarm.id, payload, userLogin.access_token),
        );

        if (!result?.success) {
          throw new Error(
            result?.error?.response?.data?.message || "Gagal update farm",
          );
        }
        await dispatch(fetchFarms(userLogin.access_token));
      }

      /*
       * ADD
       */
      else {
        // if (!createFarm) {
        //   throw new Error("createFarm belum dihubungkan.");
        // }

        // await createFarm(payload);
        await dispatch(
          addFarm({ farmData: payload, access_token: userLogin.access_token }),
        );
      }

      await dispatch(fetchFarms(userLogin.access_token));

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

      await dispatch(deleteFarm(farm.id, userLogin.access_token));

      if (selectedFarm && selectedFarm.id === farm.id) {
        setSelectedFarm(null);
      }

      await dispatch(fetchFarms(userLogin.access_token));
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
  // console.log(farmList,'farms')
  return (
    <div className="farm-layout">
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
                <strong>{farmList.length}</strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="farm-stat-icon active">●</div>

              <div>
                <span>ACTIVE</span>

                <strong>
                  {
                    farmList.filter(
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
                  {farmList
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

                <strong>
                  {farmList.filter((farm) => farm.polygon).length}
                </strong>
              </div>
            </div>
          </div>

          {/* =====================================================
            FARM LIST
        ===================================================== */}

          <FarmList
            // farms={farms}
            farmList={farmList}
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
