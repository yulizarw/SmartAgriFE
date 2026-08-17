import React, { useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import RecommendationHeader from "../component/Recommendation/RecommendationHeader";
import RecommendationSummary from "../component/Recommendation/RecommendationSummary";
import RecommendationGenerator from "../component/Recommendation/RecommendationGenerator";
import RecommendationDetail from "../component/Recommendation/RecommendationDetail";
import DecisionLogPanel from "../component/Recommendation/DecisionLogPanel";
import RelayCommandPanel from "../component/Recommendation/RelayCommandPanel";

import "./css/Recommendation.css";

export const Recommendation = ({
  generateRecommendation,
  getLatestRecommendation,
  createDecisionLog,
  getLatestDecision,
  getRelayCommand,
  logOutFunction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cropHealthId, setCropHealthId] = useState("");

  const [recommendation, setRecommendation] = useState(null);

  const [analysis, setAnalysis] = useState(null);

  const [decisionLog, setDecisionLog] = useState(null);

  const [relayCommand, setRelayCommand] = useState(null);

  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  const [loadingDecision, setLoadingDecision] = useState(false);

  const [loadingRelay, setLoadingRelay] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GENERATE RECOMMENDATION
  |--------------------------------------------------------------------------
  */

  const handleGenerate = async () => {
    if (!cropHealthId) {
      setError("Crop Health ID wajib diisi.");
      return;
    }

    try {
      setLoadingRecommendation(true);
      setError("");

      if (!generateRecommendation) {
        throw new Error("generateRecommendation belum dihubungkan.");
      }

      const result = await generateRecommendation(cropHealthId);

      const data = result?.data || result?.recommendation || null;

      setRecommendation(data);

      setAnalysis(result?.analysis || null);

      /*
       * Reset decision lama karena recommendation
       * baru saja dibuat/diperbarui.
       */

      setDecisionLog(null);
      setRelayCommand(null);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal membuat recommendation.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET LATEST RECOMMENDATION
  |--------------------------------------------------------------------------
  */

  const handleLoadLatest = async () => {
    if (!cropHealthId) {
      setError("Crop Health ID wajib diisi.");
      return;
    }

    try {
      setLoadingRecommendation(true);
      setError("");

      if (!getLatestRecommendation) {
        throw new Error("getLatestRecommendation belum dihubungkan.");
      }

      const result = await getLatestRecommendation(cropHealthId);

      setRecommendation(
        result?.data || result?.recommendation || result || null,
      );

      setAnalysis(null);

      setDecisionLog(null);
      setRelayCommand(null);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Recommendation belum tersedia.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE DECISION LOG
  |--------------------------------------------------------------------------
  */

  const handleCreateDecision = async () => {
    if (!recommendation?.id) {
      setError("Recommendation ID belum tersedia.");

      return;
    }

    try {
      setLoadingDecision(true);
      setError("");

      if (!createDecisionLog) {
        throw new Error("createDecisionLog belum dihubungkan.");
      }

      const result = await createDecisionLog(recommendation.id);

      setDecisionLog(result?.data || result?.decisionLog || null);

      /*
       * Relay command langsung tersedia
       * dari response createDecisionLog.
       */

      setRelayCommand(result?.relayCommand || null);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Gagal membuat decision log.");
    } finally {
      setLoadingDecision(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET LATEST DECISION
  |--------------------------------------------------------------------------
  */

  const handleLoadDecision = async () => {
    if (!recommendation?.id) {
      setError("Recommendation ID belum tersedia.");

      return;
    }

    try {
      setLoadingDecision(true);
      setError("");

      if (!getLatestDecision) {
        throw new Error("getLatestDecision belum dihubungkan.");
      }

      const result = await getLatestDecision(recommendation.id);

      setDecisionLog(result?.data || result?.decisionLog || result || null);
    } catch (err) {
      console.error(err);

      setError(err?.message || "Decision log belum tersedia.");
    } finally {
      setLoadingDecision(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET RELAY COMMAND
  |--------------------------------------------------------------------------
  */

  const handleLoadRelay = async () => {
    if (!recommendation?.id) {
      setError("Recommendation ID belum tersedia.");

      return;
    }

    try {
      setLoadingRelay(true);
      setError("");

      if (!getRelayCommand) {
        throw new Error("getRelayCommand belum dihubungkan.");
      }

      const result = await getRelayCommand(recommendation.id);

      setRelayCommand(result?.command || result?.relayCommand || null);

      if (result?.decisionLog) {
        setDecisionLog(result.decisionLog);
      }
    } catch (err) {
      console.error(err);

      setError(err?.message || "Relay command belum tersedia.");
    } finally {
      setLoadingRelay(false);
    }
  };

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="recommendation-page">
        <RecommendationHeader />

        {error && (
          <div className="recommendation-alert">
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

        <RecommendationSummary
          recommendation={recommendation}
          analysis={analysis}
          decisionLog={decisionLog}
        />

        <RecommendationGenerator
          cropHealthId={cropHealthId}
          setCropHealthId={setCropHealthId}
          onGenerate={handleGenerate}
          onLoadLatest={handleLoadLatest}
          loading={loadingRecommendation}
        />

        {recommendation && (
          <RecommendationDetail
            recommendation={recommendation}
            analysis={analysis}
          />
        )}

        {recommendation && (
          <DecisionLogPanel
            recommendation={recommendation}
            decisionLog={decisionLog}
            loading={loadingDecision}
            onCreate={handleCreateDecision}
            onLoadLatest={handleLoadDecision}
          />
        )}

        {recommendation && (
          <RelayCommandPanel
            recommendation={recommendation}
            relayCommand={relayCommand}
            loading={loadingRelay}
            onLoad={handleLoadRelay}
          />
        )}
      </main>
    </>
  );
};


