import React, { useEffect, useMemo, useState } from "react";

import SensorCard from "./SensorCard";

import "./css/SensorGrid.css";

const SensorGrid = ({ device, readings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  console.log(readings,'di grid')
  const readingsPerPage = 5;

  /*
  |--------------------------------------------------------------------------
  | FILTER READING BERDASARKAN DEVICE
  |--------------------------------------------------------------------------
  */
  const deviceReadings = useMemo(() => {
    if (!device) {
      return [];
    }

    return readings
      .filter(
        (reading) => Number(reading.Sensor?.deviceId) === Number(device.id),
      )
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  }, [readings, device]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.ceil(deviceReadings.length / readingsPerPage);

  const startIndex = (currentPage - 1) * readingsPerPage;

  const currentReadings = deviceReadings.slice(
    startIndex,
    startIndex + readingsPerPage,
  );

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE SAAT DEVICE BERUBAH
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [device?.id]);

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE JIKA DATA BERKURANG
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  /*
  |--------------------------------------------------------------------------
  | DEVICE BELUM DIPILIH
  |--------------------------------------------------------------------------
  */
  if (!device) {
    return (
      <div className="sensor-grid-empty">
        <div className="sensor-grid-empty-icon">📡</div>

        <h3>Select a Device</h3>

        <p>Pilih device di sebelah kiri untuk melihat sensor.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | TIDAK ADA DATA SENSOR
  |--------------------------------------------------------------------------
  */
  if (!deviceReadings.length) {
    return (
      <div className="sensor-grid-empty">
        <div className="sensor-grid-empty-icon">🌱</div>

        <h3>No Sensor Data</h3>

        <p>Belum ada data sensor untuk device ini.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SENSOR GRID
  |--------------------------------------------------------------------------
  */
  return (
    <div className="sensor-grid-container">
      <div className="sensor-grid">
        {currentReadings.map((reading) => (
          <SensorCard key={reading.id} reading={reading} />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="sensor-grid-pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default SensorGrid;
