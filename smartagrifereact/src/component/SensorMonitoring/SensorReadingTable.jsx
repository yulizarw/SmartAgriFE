// import React from "react";

// import "./css/SensorReadingTable.css";

// const SensorReadingTable = ({ readings }) => {
//   return (
//     <div className="sensor-reading-panel">
//       <div className="sensor-reading-header">
//         <div>
//           <span>RECENT DATA</span>

//           <h3>Sensor Readings</h3>
//         </div>

//         <span>{readings.length} readings</span>
//       </div>

//       {readings.length === 0 ? (
//         <div className="sensor-reading-empty">
//           No sensor readings available.
//         </div>
//       ) : (
//         <div className="sensor-reading-table-wrapper">
//           <table className="sensor-reading-table">
//             <thead>
//               <tr>
//                 <th>Sensor</th>
//                 <th>Value</th>
//                 <th>Timestamp</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {readings.map((reading, index) => (
//                 <tr key={reading.sensorId || index}>
//                   <td>
//                     <strong>{reading.Sensor.sensorType|| "Unknown Sensor"}</strong>
//                   </td>

//                   <td>{reading.value}</td>

//                   <td>
//                     {reading.recordedAt
//                       ? new Date(reading.recordedAt).toLocaleString("id-ID")
//                       : "-"}
//                   </td>

//                   <td>
//                     <span className="reading-success">
//                       {reading.status || "SUCCESS"}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SensorReadingTable;

import React, { useEffect, useState } from "react";

import "./css/SensorReadingTable.css";

const SensorReadingTable = ({ readings = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const totalPages = Math.ceil(readings.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentReadings = readings.slice(startIndex, startIndex + rowsPerPage);

  // Kalau readings berubah dan halaman sekarang sudah tidak valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    if (readings.length === 0) {
      setCurrentPage(1);
    }
  }, [readings, currentPage, totalPages]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="sensor-reading-panel">
      <div className="sensor-reading-header">
        <div>
          <span>RECENT DATA</span>

          <h3>Sensor Readings</h3>
        </div>

        <span>{readings.length} readings</span>
      </div>

      {readings.length === 0 ? (
        <div className="sensor-reading-empty">
          No sensor readings available.
        </div>
      ) : (
        <>
          <div className="sensor-reading-table-wrapper">
            <table className="sensor-reading-table">
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Value</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {currentReadings.map((reading, index) => (
                  <tr
                    key={
                      reading.id ||
                      `${reading.sensorId}-${reading.recordedAt}-${index}`
                    }
                  >
                    <td>
                      <strong>
                        {reading.Sensor?.sensorType || "Unknown Sensor"}
                      </strong>
                    </td>

                    <td>{reading.value}</td>

                    <td>
                      {reading.recordedAt
                        ? new Date(reading.recordedAt).toLocaleString("id-ID")
                        : "-"}
                    </td>

                    <td>
                      <span className="reading-success">
                        {reading.status || "SUCCESS"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="sensor-reading-pagination">
            <span>
              Showing {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, readings.length)} of{" "}
              {readings.length}
            </span>

            <div className="pagination-buttons">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorReadingTable;