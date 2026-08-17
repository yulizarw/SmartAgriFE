import React from "react";

import "./css/RelayCommandPanel.css";

const RelayCommandPanel = ({
  recommendation,
  relayCommand,
  loading,
  onLoad,
}) => {
  return (
    <section className="relay-command-panel">
      <div className="relay-command-header">
        <div>
          <span>IoT AUTOMATION</span>

          <h2>Relay Command</h2>

          <p>
            Perintah yang akan digunakan oleh perangkat IoT untuk mengendalikan
            relay.
          </p>
        </div>

        <div className="relay-command-icon">⚡</div>
      </div>

      <div className="relay-command-content">
        <div className="relay-command-status">
          <span className={relayCommand ? "online" : "offline"} />

          {relayCommand ? "COMMAND AVAILABLE" : "COMMAND NOT AVAILABLE"}
        </div>

        {relayCommand ? (
          <pre>
            {typeof relayCommand === "object"
              ? JSON.stringify(relayCommand, null, 2)
              : String(relayCommand)}
          </pre>
        ) : (
          <div className="relay-empty">
            <span>📡</span>

            <strong>Relay command belum tersedia</strong>

            <p>
              Ambil command terbaru untuk Recommendation #{recommendation?.id}.
            </p>
          </div>
        )}

        <button
          type="button"
          className="relay-load-button"
          onClick={onLoad}
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "⚡ Get Relay Command"}
        </button>
      </div>
    </section>
  );
};

export default RelayCommandPanel;
