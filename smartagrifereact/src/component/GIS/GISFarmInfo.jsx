import React from "react";

const GISFarmInfo = ({ farm }) => {
  if (!farm) {
    return (
      <section className="gis-farm-info empty">
        <span>FARM INFORMATION</span>

        <h3>Belum ada farm dipilih</h3>

        <p>
          Pilih farm untuk melihat informasi lokasi dan parameter geospasial.
        </p>
      </section>
    );
  }

  return (
    <section className="gis-farm-info">
      <div className="gis-card-header">
        <div>
          <span>FARM INFORMATION</span>

          <h3>{farm.name}</h3>
        </div>

        <span className="gis-farm-status">
          {farm.status === false ? "INACTIVE" : "ACTIVE"}
        </span>
      </div>

      <div className="gis-info-grid">
        <div>
          <span>Area</span>
          <strong>{farm.area ?? "-"}</strong>
        </div>

        <div>
          <span>Latitude</span>
          <strong>{farm.latitude ?? "-"}</strong>
        </div>

        <div>
          <span>Longitude</span>
          <strong>{farm.longitude ?? "-"}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{farm.status === false ? "Inactive" : "Active"}</strong>
        </div>
      </div>

      <div className="gis-address">
        <span>Address</span>

        <p>{farm.address || "Alamat belum tersedia"}</p>
      </div>
    </section>
  );
};

export default GISFarmInfo;
