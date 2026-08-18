// import React from "react";

// import "./css/IrrigationHistory.css";

// const formatDate = (date) => {
//   if (!date) {
//     return "-";
//   }

//   const parsed = new Date(date);

//   if (Number.isNaN(parsed.getTime())) {
//     return "-";
//   }

//   return parsed.toLocaleString("id-ID");
// };

// const IrrigationHistory = ({ recommendation, decision }) => {
//   return (
//     <section className="irrigation-history-card">
//       <div className="irrigation-history-header">
//         <div>
//           <span>ACTIVITY</span>

//           <h2>Latest Irrigation Activity</h2>
//         </div>
//       </div>

//       <div className="irrigation-history-list">
//         <div className="irrigation-history-item">
//           <div className="history-icon">🤖</div>

//           <div className="history-content">
//             <strong>Recommendation updated</strong>

//             <span>
//               Sistem menghasilkan recommendation terbaru untuk irrigation.
//             </span>
//           </div>

//           <time>
//             {formatDate(recommendation?.updatedAt || recommendation?.createdAt)}
//           </time>
//         </div>

//         <div className="irrigation-history-item">
//           <div className="history-icon">⚡</div>

//           <div className="history-content">
//             <strong>Decision log updated</strong>

//             <span>Decision system menghasilkan perintah relay.</span>
//           </div>

//           <time>{formatDate(decision?.updatedAt || decision?.createdAt)}</time>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default IrrigationHistory;


import React, { useMemo } from "react";

const IrrigationHistory = ({
  history = [],

  loading = false,

  pagination = {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  currentPage = 1,

  onPrevious,

  onNext,

  onPageChange,
}) => {
  // ============================================================
  // NORMALIZE HISTORY
  // ============================================================

  const historyData = useMemo(() => {
    if (!Array.isArray(history)) {
      return [];
    }

    return history;
  }, [history]);

  // ============================================================
  // PAGE NUMBERS
  // ============================================================

  const pageNumbers = useMemo(() => {
    const totalPages = Number(pagination?.totalPages) || 0;

    const page = Number(currentPage) || 1;

    if (totalPages <= 1) {
      return [];
    }

    /*
     * Maksimal 5 nomor halaman:
     *
     * 1 2 3 4 5
     *
     * lalu:
     *
     * 3 4 5 6 7
     */

    const maxVisible = 5;

    let startPage = Math.max(1, page - 2);

    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    /*
     * Kalau sudah dekat halaman terakhir,
     * geser startPage.
     */

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [pagination?.totalPages, currentPage]);

  // ============================================================
  // EMPTY
  // ============================================================

  if (!loading && historyData.length === 0) {
    return (
      <section className="irrigation-history-card">
        <div className="irrigation-section-header">
          <div>
            <h2>Irrigation History</h2>

            <p>
              Riwayat hasil automation, recommendation, decision dan perintah
              relay.
            </p>
          </div>
        </div>

        <div className="irrigation-empty-card">
          Belum ada riwayat irrigation.
        </div>
      </section>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="irrigation-history-card">
      {/* ==================================================== */}
      {/* HEADER                                               */}
      {/* ==================================================== */}

      <div className="irrigation-section-header">
        <div>
          <h2>Irrigation History</h2>

          <p>
            Riwayat analisis tanaman, recommendation, decision dan command
            relay.
          </p>
        </div>

        <div className="irrigation-history-total">
          Total <strong>{pagination?.totalItems || 0}</strong> data
        </div>
      </div>

      {/* ==================================================== */}
      {/* LOADING                                              */}
      {/* ==================================================== */}

      {loading && (
        <div className="irrigation-history-loading">Memuat history...</div>
      )}

      {/* ==================================================== */}
      {/* TABLE                                                */}
      {/* ==================================================== */}

      {!loading && historyData.length > 0 && (
        <>
          <div className="irrigation-history-table-wrapper">
            <table className="irrigation-history-table">
              <thead>
                <tr>
                  <th>No</th>

                  <th>Waktu</th>

                  <th>Crop Health</th>

                  <th>Recommendation</th>

                  <th>Priority</th>

                  <th>Decision</th>

                  <th>Source</th>

                  <th>Sensor</th>

                  <th>Confidence</th>

                  <th>Mode</th>
                </tr>
              </thead>

              <tbody>
                {historyData.map((item, index) => {
                  const cropHealth = item?.cropHealth || null;

                  const recommendation = item?.recommendation || null;

                  const decision = item?.decision || null;

                  const command =
                    item?.relayCommand || decision?.decision || "WATERING_OFF";

                  const mode = item?.controlMode || detectMode(decision);

                  const rowNumber = calculateRowNumber({
                    page: pagination?.page || currentPage,

                    limit: pagination?.limit || 20,

                    index,
                  });

                  return (
                    <tr
                      key={
                        decision?.id ||
                        recommendation?.id ||
                        cropHealth?.id ||
                        `${currentPage}-${index}`
                      }
                    >
                      {/* ============================= */}
                      {/* NUMBER                        */}
                      {/* ============================= */}

                      <td>{rowNumber}</td>

                      {/* ============================= */}
                      {/* TIME                          */}
                      {/* ============================= */}

                      <td>
                        <div className="history-date">
                          {formatDateTime(
                            item?.createdAt ||
                              decision?.createdAt ||
                              recommendation?.createdAt ||
                              cropHealth?.createdAt,
                          )}
                        </div>
                      </td>

                      {/* ============================= */}
                      {/* CROP HEALTH                   */}
                      {/* ============================= */}

                      <td>
                        {cropHealth ? (
                          <div className="history-health">
                            <strong>
                              {formatScore(cropHealth.overallScore)}
                            </strong>

                            <span>
                              {getHealthStatus(cropHealth.overallScore)}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* ============================= */}
                      {/* RECOMMENDATION                */}
                      {/* ============================= */}

                      <td>
                        <div className="history-recommendation">
                          {recommendation?.recommendation ||
                            "Tidak ada recommendation"}
                        </div>
                      </td>

                      {/* ============================= */}
                      {/* PRIORITY                      */}
                      {/* ============================= */}

                      <td>
                        <PriorityBadge priority={recommendation?.priority} />
                      </td>

                      {/* ============================= */}
                      {/* DECISION                      */}
                      {/* ============================= */}

                      <td>
                        <DecisionBadge command={command} />
                      </td>

                      {/* ============================= */}
                      {/* SOURCE                        */}
                      {/* ============================= */}

                      <td>
                        <SourceBadge source={decision?.source} />
                      </td>

                      {/* ============================= */}
                      {/* SENSOR                        */}
                      {/* ============================= */}

                      <td>{formatScore(decision?.sensorValue)}</td>

                      {/* ============================= */}
                      {/* CONFIDENCE                    */}
                      {/* ============================= */}

                      <td>{formatConfidence(decision?.confidence)}</td>

                      {/* ============================= */}
                      {/* MODE                          */}
                      {/* ============================= */}

                      <td>
                        <ModeBadge mode={mode} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ================================================= */}
          {/* PAGINATION                                       */}
          {/* ================================================= */}

          <div className="irrigation-history-pagination">
            {/* =============================================== */}
            {/* INFO                                            */}
            {/* =============================================== */}

            <div className="history-pagination-info">
              Page <strong>{pagination?.page || currentPage}</strong> of{" "}
              <strong>{pagination?.totalPages || 1}</strong>
              <span>
                {" "}
                • {pagination?.totalItems || historyData.length} total data
              </span>
            </div>

            {/* =============================================== */}
            {/* CONTROLS                                        */}
            {/* =============================================== */}

            <div className="history-pagination-controls">
              <button
                type="button"
                className="history-pagination-button"
                onClick={onPrevious}
                disabled={loading || !pagination?.hasPrevPage}
              >
                ← Previous
              </button>

              {/* FIRST PAGE */}

              {pageNumbers.length > 0 && pageNumbers[0] > 1 && (
                <>
                  <button
                    type="button"
                    className={
                      currentPage === 1
                        ? "history-page-button active"
                        : "history-page-button"
                    }
                    onClick={() => onPageChange?.(1)}
                  >
                    1
                  </button>

                  {pageNumbers[0] > 2 && (
                    <span className="history-pagination-dots">...</span>
                  )}
                </>
              )}

              {/* PAGE NUMBERS */}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    Number(currentPage) === page
                      ? "history-page-button active"
                      : "history-page-button"
                  }
                  onClick={() => onPageChange?.(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              ))}

              {/* LAST PAGE */}

              {pageNumbers.length > 0 &&
                pageNumbers[pageNumbers.length - 1] <
                  pagination?.totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] <
                      pagination.totalPages - 1 && (
                      <span className="history-pagination-dots">...</span>
                    )}

                    <button
                      type="button"
                      className={
                        Number(currentPage) === pagination.totalPages
                          ? "history-page-button active"
                          : "history-page-button"
                      }
                      onClick={() => onPageChange?.(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}

              <button
                type="button"
                className="history-pagination-button"
                onClick={onNext}
                disabled={loading || !pagination?.hasNextPage}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

// ============================================================
// PRIORITY BADGE
// ============================================================

const PriorityBadge = ({ priority }) => {
  const normalized = String(priority || "LOW")
    .trim()
    .toUpperCase();

  return (
    <span
      className={
        `history-badge ` + `history-priority-${normalized.toLowerCase()}`
      }
    >
      {normalized}
    </span>
  );
};

// ============================================================
// DECISION BADGE
// ============================================================

const DecisionBadge = ({ command }) => {
  const normalized = String(command || "WATERING_OFF")
    .trim()
    .toUpperCase();

  const isOn = normalized === "WATERING_ON";

  return (
    <span
      className={
        isOn
          ? "history-badge history-decision-on"
          : "history-badge history-decision-off"
      }
    >
      {normalized}
    </span>
  );
};

// ============================================================
// SOURCE BADGE
// ============================================================

const SourceBadge = ({ source }) => {
  const normalized = String(source || "AUTO")
    .trim()
    .toUpperCase();

  const manual =
    normalized.includes("MANUAL") ||
    normalized.includes("OVERRIDE") ||
    normalized.includes("USER");

  return (
    <span
      className={
        manual
          ? "history-badge history-source-manual"
          : "history-badge history-source-auto"
      }
    >
      {normalized}
    </span>
  );
};

// ============================================================
// MODE BADGE
// ============================================================

const ModeBadge = ({ mode }) => {
  const normalized = String(mode || "AUTO")
    .trim()
    .toUpperCase();

  return (
    <span
      className={
        normalized === "OVERRIDE"
          ? "history-badge history-mode-override"
          : "history-badge history-mode-auto"
      }
    >
      {normalized}
    </span>
  );
};

// ============================================================
// DETECT MODE
// ============================================================

function detectMode(decision) {
  const source = String(decision?.source || "AUTO")
    .trim()
    .toUpperCase();

  if (
    source.includes("MANUAL") ||
    source.includes("OVERRIDE") ||
    source.includes("USER")
  ) {
    return "OVERRIDE";
  }

  return "AUTO";
}

// ============================================================
// ROW NUMBER
// ============================================================

function calculateRowNumber({ page, limit, index }) {
  const currentPage = Number(page) || 1;

  const currentLimit = Number(limit) || 20;

  return (currentPage - 1) * currentLimit + index + 1;
}

// ============================================================
// HEALTH STATUS
// ============================================================

function getHealthStatus(value) {
  if (value === null || value === undefined || value === "") {
    return "NO DATA";
  }

  const score = Number(value);

  if (Number.isNaN(score)) {
    return "UNKNOWN";
  }

  if (score < 40) {
    return "POOR";
  }

  if (score < 60) {
    return "WARNING";
  }

  if (score < 80) {
    return "GOOD";
  }

  return "EXCELLENT";
}

// ============================================================
// FORMAT SCORE
// ============================================================

function formatScore(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(1);
}

// ============================================================
// FORMAT CONFIDENCE
// ============================================================

function formatConfidence(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const confidence = Number(value);

  if (Number.isNaN(confidence)) {
    return "-";
  }

  /*
   * Database:
   *
   * 0.9 -> 90%
   *
   * Tapi jika suatu saat backend
   * sudah mengirim 90 langsung,
   * jangan menjadi 9000%.
   */

  if (confidence <= 1) {
    return `${Math.round(confidence * 100)}%`;
  }

  return `${Math.round(confidence)}%`;
}

// ============================================================
// DATE
// ============================================================

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

export default IrrigationHistory;