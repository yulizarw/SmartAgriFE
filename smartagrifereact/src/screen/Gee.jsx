import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../component/Sidebar/SideBar";
import GeeHeader from "../component/Gee/GeeHeader";
import GeeFarmCard from "../component/Gee/GeeFarmCard";
import GeeFarmMap from "../component/Gee/GeeFarmMap";
import Loading from "../component/Loading/Loading";

import { getGeeHistories } from "../store/action/geeAction";
import { getWeatherForecasts } from "../store/action/weatherAction";
import { cropLists } from "../store/action/cropAction";
import { fetchFarms } from "../store/action/farmAction";

import "./css/Gee.css";

export const Gee = ({ logOutFunction }) => {
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // =========================================
  // REDUX
  // =========================================

  const farms = useSelector((state) => state.farmReducers.farms);
  const listCrop = useSelector((state) => state.cropReducers.listCrop);
  const userLogin = useSelector((state) => state.userReducers.userLogin);
  const geeHistories = useSelector((state) => state.geeReducers.geeHistories);

  const weatherForecasts = useSelector(
    (state) => state.weatherReducers.weatherForecasts,
  );

  const geeLoading = useSelector((state) => state.geeReducers?.loading);
  const weatherLoading = useSelector((state) => state.weatherReducers?.loading);

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    if (userLogin?.access_token) {
      dispatch(getGeeHistories());
      dispatch(getWeatherForecasts());
      dispatch(fetchFarms(userLogin.access_token));
      dispatch(cropLists(userLogin.access_token));
    }
  }, [userLogin?.access_token, dispatch]);

  // =========================================
  // FARM YANG MEMILIKI CROP
  // =========================================

  const farmsWithCrop = useMemo(() => {
    if (!farms || !listCrop) {
      return [];
    }

    return farms
      .map((farm) => {
        const crop = listCrop.find(
          (item) => Number(item.farmId) === Number(farm.id),
        );

        if (!crop) {
          return null;
        }

        return {
          ...farm,
          crop,
        };
      })
      .filter(Boolean);
  }, [farms, listCrop]);

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.ceil(farmsWithCrop.length / itemsPerPage);

  const paginatedFarms = useMemo(() => {
    const start = (page - 1) * itemsPerPage;

    return farmsWithCrop.slice(start, start + itemsPerPage);
  }, [farmsWithCrop, page]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // =========================================
  // GET GEE DATA FARM
  // =========================================

  // const getFarmGeeHistory = (farmId, cropId) => {
  //   return geeHistories.find(
  //     (item) =>
  //       Number(item.farmId) === Number(farmId) &&
  //       Number(item.cropId) === Number(cropId),
  //   );
  // };

  const getFarmGeeHistory = (farmId, cropId) => {
    if (!Array.isArray(geeHistories)) {
      return null;
    }

    const farmData = geeHistories.find(
      (item) =>
        Number(item.farm?.id) === Number(farmId) &&
        Number(item.crop?.id) === Number(cropId),
    );

    if (!farmData || !Array.isArray(farmData.histories)) {
      return null;
    }

    // Ambil history terbaru
    return (
      farmData.histories
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    );
  };

  // =========================================
  // GET WEATHER DATA FARM
  // =========================================

  const getFarmWeather = (farmId) => {
    return weatherForecasts.find(
      (item) => Number(item.farmId) === Number(farmId),
    );
  };

  // console.log("Farm yang sedang ditampilkan:", farm.id, farm.crop?.id);
  console.log("geeHistories:", geeHistories);

  console.table(
    Array.isArray(geeHistories)
      ? geeHistories.map((item) => ({
          id: item.id,
          farmId: item.farmId,
          cropId: item.cropId,
          date: item.date,
          ndvi: item.ndvi,
        }))
      : [],
  );

  return (
    <>
      <Loading />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="gee-page">
        <GeeHeader />

        {/* =====================================
            HEADER
        ====================================== */}

        <section className="gee-dashboard-header">
          <div>
            <span className="gee-section-label">SMART AGRICULTURE GIS</span>

            <h1>Farm Earth Observation</h1>

            <p>
              Monitoring kondisi lahan berdasarkan satellite imagery dan data
              cuaca.
            </p>
          </div>

          <div className="gee-update-status">
            <span className="gee-status-dot" />
            Data diperbarui otomatis oleh scheduler
          </div>
        </section>

        {/* =====================================
            MAP
        ====================================== */}

        <section className="gee-map-section">
          <div className="gee-map-header">
            <div>
              <span className="gee-section-label">
                GEOGRAPHIC INFORMATION SYSTEM
              </span>

              <h2>Farm Monitoring Map</h2>
            </div>

            <div className="gee-map-counter">{farmsWithCrop.length} Farm</div>
          </div>

          <GeeFarmMap
            // farms={paginatedFarms}
            farms={paginatedFarms}
            getFarmGeeHistory={getFarmGeeHistory}
            getFarmWeather={getFarmWeather}
          />
        </section>

        {/* =====================================
            FARM CARDS
        ====================================== */}

        <section className="gee-farm-section">
          <div className="gee-farm-section-header">
            <div>
              <span className="gee-section-label">FARM OBSERVATION</span>

              <h2>Farm & Crop Monitoring</h2>
            </div>

            <span>
              Page {page} / {Math.max(totalPages, 1)}
            </span>
          </div>
          {}

          {/* {paginatedFarms.map((farm) => {
            const farmId = farm.id;
            const cropId = farm.crop?.id;

            const gee = getFarmGeeHistory(farmId, cropId);
            const weather = getFarmWeather(farmId);

            console.log("FARM:", farm.name);
            console.log("FARM ID:", farmId);
            console.log("CROP ID:", cropId);
            console.log("GEE:", gee);
            console.log("WEATHER:", weather);

            return (
              <GeeFarmCard
                key={farm.id}
                farm={farm}
                crop={farm.crop}
                gee={gee}
                weather={weather}
              />
            );
          })} */}
          <div className="gee-farm-grid">
            {paginatedFarms.map((farm) => {
              const gee = getFarmGeeHistory(farm.id, farm.crop?.id);

              const weather = getFarmWeather(farm.id);

              return (
                <GeeFarmCard
                  key={farm.id}
                  farm={farm}
                  crop={farm.crop}
                  gee={gee}
                  weather={weather}
                />
              );
            })}
          </div>

          {/* =====================================
              PAGINATION
          ====================================== */}

          {/* {totalPages > 1 && (
            <div className="gee-pagination">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    className={page === number ? "active" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next →
              </button>
            </div>
          )} */}

          {totalPages > 1 && (
            <div className="gee-pagination">
              <button
                type="button"
                className="gee-pagination-arrow"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    className={`gee-pagination-number ${
                      page === number ? "active" : ""
                    }`}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ),
              )}

              <button
                type="button"
                className="gee-pagination-arrow"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                →
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};
