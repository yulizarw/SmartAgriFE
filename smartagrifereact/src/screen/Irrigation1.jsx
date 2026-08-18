import React, { useEffect, useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import IrrigationHeader from "../component/Irrigation/IrrigationHeader";
import IrrigationStatus from "../component/Irrigation/IrrigationStatus";
import IrrigationControl from "../component/Irrigation/IrrigationControl";
import IrrigationDecision from "../component/Irrigation/IrrigationDecision";
import IrrigationHistory from "../component/Irrigation/IrrigationHistory";

import "./css/Irrigation.css";

export const Irrigation = ({
  logOutFunction,

  // nanti dihubungkan dari App.jsx / Redux
  getLatestRecommendation,
  getLatestDecision,
  getRelayCommand,

  // nanti untuk endpoint override
  overrideIrrigation,
  resumeAutoIrrigation,

  recommendationId,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [recommendation, setRecommendation] = useState(null);

  const [decision, setDecision] = useState(null);

  const [relay, setRelay] = useState(null);

  const [loading, setLoading] = useState(true);

  const [controlLoading, setControlLoading] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD IRRIGATION STATUS
  |--------------------------------------------------------------------------
  */

  const loadIrrigationStatus = async () => {
    if (!recommendationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [recommendationResult, decisionResult, relayResult] =
        await Promise.all([
          getLatestRecommendation
            ? getLatestRecommendation(recommendationId)
            : null,

          getLatestDecision ? getLatestDecision(recommendationId) : null,

          getRelayCommand ? getRelayCommand(recommendationId) : null,
        ]);

      setRecommendation(
        recommendationResult?.data || recommendationResult || null,
      );

      setDecision(decisionResult?.data || decisionResult || null);

      setRelay(
        relayResult?.command
          ? {
              command: relayResult.command,
              decisionLog: relayResult.decisionLog,
            }
          : relayResult || null,
      );
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengambil status irrigation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIrrigationStatus();
  }, [recommendationId]);

  /*
  |--------------------------------------------------------------------------
  | PUMP STATUS
  |--------------------------------------------------------------------------
  */

  const getPumpStatus = () => {
    const command =
      relay?.command || decision?.relayCommand || decision?.command || "";

    const normalized = String(command).toUpperCase();

    if (normalized.includes("ON") || normalized.includes("START")) {
      return "ON";
    }

    return "OFF";
  };

  const pumpStatus = getPumpStatus();

  /*
  |--------------------------------------------------------------------------
  | OVERRIDE OFF
  |--------------------------------------------------------------------------
  */

  const handleEmergencyOff = async () => {
    const confirmed = window.confirm(
      "Matikan pompa secara manual?\n\nPompa akan dihentikan tanpa menunggu recommendation berikutnya.",
    );

    if (!confirmed) {
      return;
    }

    if (!overrideIrrigation) {
      alert("Endpoint override belum dihubungkan ke backend.");

      return;
    }

    try {
      setControlLoading(true);
      setError("");

      await overrideIrrigation({
        recommendationId,
        command: "OFF",
        source: "USER_OVERRIDE",
      });

      await loadIrrigationStatus();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal melakukan override pompa.");
    } finally {
      setControlLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESUME AUTO
  |--------------------------------------------------------------------------
  */

  const handleResumeAuto = async () => {
    if (!resumeAutoIrrigation) {
      alert("Endpoint resume auto belum dihubungkan ke backend.");

      return;
    }

    try {
      setControlLoading(true);
      setError("");

      await resumeAutoIrrigation({
        recommendationId,
      });

      await loadIrrigationStatus();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal mengembalikan kontrol otomatis.");
    } finally {
      setControlLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="irrigation-page">
        <IrrigationHeader pumpStatus={pumpStatus} loading={loading} />

        {error && (
          <div className="irrigation-alert">
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

        <IrrigationStatus
          loading={loading}
          pumpStatus={pumpStatus}
          recommendation={recommendation}
          decision={decision}
          relay={relay}
        />

        <div className="irrigation-main-grid">
          <IrrigationControl
            pumpStatus={pumpStatus}
            loading={controlLoading}
            onEmergencyOff={handleEmergencyOff}
            onResumeAuto={handleResumeAuto}
          />

          <IrrigationDecision
            recommendation={recommendation}
            decision={decision}
            relay={relay}
          />
        </div>

        <IrrigationHistory
          recommendation={recommendation}
          decision={decision}
        />
      </main>
    </>
  );
};


