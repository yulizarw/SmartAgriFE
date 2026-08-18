// import React from "react";

// import "./css/IrrigationControl.css";

// const IrrigationControl = ({
//   pumpStatus,
//   loading,
//   onEmergencyOff,
//   onResumeAuto,
// }) => {
//   const isOn = pumpStatus === "ON";

//   return (
//     <section className="irrigation-control-card">
//       <div className="irrigation-control-header">
//         <div>
//           <span>MANUAL CONTROL</span>

//           <h2>Pump Control</h2>
//         </div>

//         <div className={isOn ? "pump-indicator on" : "pump-indicator"}>
//           <span />

//           {isOn ? "RUNNING" : "STOPPED"}
//         </div>
//       </div>

//       <div className="irrigation-control-body">
//         <div className="pump-visual">
//           <div className={isOn ? "pump-circle running" : "pump-circle"}>💧</div>

//           <strong>{isOn ? "Irrigation Active" : "Irrigation Stopped"}</strong>

//           <small>
//             {isOn
//               ? "Pompa sedang menerima perintah ON."
//               : "Pompa saat ini dalam kondisi OFF."}
//           </small>
//         </div>

//         <div className="irrigation-control-actions">
//           {isOn && (
//             <button
//               type="button"
//               className="irrigation-stop-button"
//               onClick={onEmergencyOff}
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "⛔ Turn OFF Pump"}
//             </button>
//           )}

//           {!isOn && (
//             <button
//               type="button"
//               className="irrigation-auto-button"
//               onClick={onResumeAuto}
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "↻ Resume Auto Control"}
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="irrigation-warning">
//         <span>⚠️</span>

//         <div>
//           <strong>Manual Override</strong>

//           <p>
//             Gunakan tombol ini apabila pompa tidak berhenti secara otomatis
//             akibat keterlambatan pembacaan sensor soil moisture.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default IrrigationControl;
// import "./css/IrrigationControl.css";

// const IrrigationControl = ({
//   pumpStatus,
//   loading,
//   onEmergencyOff,
//   onResumeAuto,
//   controlMode,
// }) => {
//   const isOverride = String(controlMode).trim().toUpperCase() === "OVERRIDE";

//   const isPumpOn = String(pumpStatus).trim().toUpperCase() === "ON";

//   return (
//     <section className="irrigation-control-card">
//       <div className="irrigation-card-header">
//         <div>
//           <span className="irrigation-card-label">MANUAL CONTROL</span>

//           <h2>Pump Control</h2>
//         </div>

//         <span
//           className={
//             isPumpOn
//               ? "irrigation-status-badge active"
//               : "irrigation-status-badge stopped"
//           }
//         >
//           {isPumpOn ? "● RUNNING" : "● STOPPED"}
//         </span>
//       </div>

//       <div className="irrigation-control-content">
//         <div className="irrigation-pump-icon">💧</div>

//         <h3>{isPumpOn ? "Irrigation Active" : "Irrigation Stopped"}</h3>

//         <p>
//           {isPumpOn
//             ? "Pompa sedang melakukan penyiraman."
//             : "Pompa saat ini dalam kondisi OFF."}
//         </p>

//         {/* ============================================== */}
//         {/* MODE AUTO                                     */}
//         {/* ============================================== */}

//         {!isOverride && (
//           <button
//             type="button"
//             className="irrigation-emergency-button"
//             onClick={onEmergencyOff}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "⏹ Emergency Stop"}
//           </button>
//         )}

//         {/* ============================================== */}
//         {/* MODE OVERRIDE                                 */}
//         {/* ============================================== */}

//         {isOverride && (
//           <button
//             type="button"
//             className="irrigation-resume-button"
//             onClick={onResumeAuto}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "↻ Resume Auto Control"}
//           </button>
//         )}
//       </div>

//       {isOverride && (
//         <div className="irrigation-override-warning">
//           <span>⚠</span>

//           <div>
//             <strong>Manual Override</strong>

//             <p>
//               Sistem sedang berada dalam mode manual. Tekan Resume Auto Control
//               untuk mengembalikan kontrol ke automation.
//             </p>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default IrrigationControl;


import React from "react";

const IrrigationControl = ({
  pumpStatus,

  loading,

  controlMode,

  onManualOverride,

  onResumeAuto,
}) => {
  // ============================================================
  // NORMALIZE
  // ============================================================

  const normalizedPump = String(pumpStatus || "OFF")
    .trim()
    .toUpperCase();

  const normalizedMode = String(controlMode || "AUTO")
    .trim()
    .toUpperCase();

  // ============================================================
  // STATE
  // ============================================================

  const isPumpOn = normalizedPump === "ON";

  const isOverride = normalizedMode === "OVERRIDE";

  // ============================================================
  // MANUAL COMMAND
  // ============================================================
  //
  // AUTO + pump ON
  //     -> command WATERING_OFF
  //
  // AUTO + pump OFF
  //     -> command WATERING_ON
  //
  // ============================================================

  const manualCommand = isPumpOn ? "WATERING_OFF" : "WATERING_ON";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="irrigation-control-card">
      {/* ==================================================== */}
      {/* HEADER                                               */}
      {/* ==================================================== */}

      <div className="irrigation-card-header">
        <div>
          <span className="irrigation-card-label">MANUAL CONTROL</span>

          <h2>Pump Control</h2>
        </div>

        <span
          className={
            isPumpOn
              ? "irrigation-status-badge active"
              : "irrigation-status-badge stopped"
          }
        >
          {isPumpOn ? "● RUNNING" : "● STOPPED"}
        </span>
      </div>

      {/* ==================================================== */}
      {/* BODY                                                 */}
      {/* ==================================================== */}

      <div className="irrigation-control-content">
        <div className="irrigation-pump-icon">💧</div>

        <h3>{isPumpOn ? "Irrigation Active" : "Irrigation Stopped"}</h3>

        <p>
          {isPumpOn
            ? "Pompa sedang melakukan penyiraman."
            : "Pompa saat ini dalam kondisi OFF."}
        </p>

        {/* ================================================== */}
        {/* MODE AUTO                                         */}
        {/* ================================================== */}

        {!isOverride && (
          <>
            {/* ============================================== */}
            {/* AUTO + PUMP ON                                */}
            {/* ============================================== */}

            {isPumpOn ? (
              <button
                type="button"
                className="irrigation-emergency-button"
                disabled={loading}
                onClick={() => onManualOverride?.("WATERING_OFF")}
              >
                {loading ? "Processing..." : "⏹ Emergency Stop"}
              </button>
            ) : (
              /* ============================================ */
              /* AUTO + PUMP OFF                             */
              /* ============================================ */

              <button
                type="button"
                className="irrigation-manual-on-button"
                disabled={loading}
                onClick={() => onManualOverride?.("WATERING_ON")}
              >
                {loading ? "Processing..." : "💧 Manual Watering ON"}
              </button>
            )}
          </>
        )}

        {/* ================================================== */}
        {/* MODE OVERRIDE                                     */}
        {/* ================================================== */}

        {isOverride && (
          <button
            type="button"
            className="irrigation-resume-button"
            disabled={loading}
            onClick={onResumeAuto}
          >
            {loading ? "Processing..." : "↻ Resume Auto Control"}
          </button>
        )}
      </div>

      {/* ==================================================== */}
      {/* AUTO INFO                                            */}
      {/* ==================================================== */}

      {!isOverride && (
        <div className="irrigation-auto-info">
          <span>🤖</span>

          <div>
            <strong>Automatic Control</strong>

            <p>
              Sistem sedang mengikuti keputusan otomatis berdasarkan CropHealth
              dan Recommendation.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* OVERRIDE WARNING                                     */}
      {/* ==================================================== */}

      {isOverride && (
        <div className="irrigation-override-warning">
          <span>⚠</span>

          <div>
            <strong>Manual Override</strong>

            <p>
              Pompa sedang dikontrol secara manual. Tekan Resume Auto Control
              untuk mengembalikan kontrol ke automation.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default IrrigationControl;