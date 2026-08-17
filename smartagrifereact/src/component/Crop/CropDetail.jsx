import React from "react";

const CropDetail = ({ crop, farmName, onEdit, onDelete, onClose, farmList }) => {
  return (
    <div className="crop-detail">
      <div className="crop-detail-header">
        <div>
          <span>CROP DETAILS</span>

          <h2>{crop.cropName}</h2>

          <small>{crop.variety || "No variety"}</small>
        </div>

        <button type="button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="crop-detail-body">
        <div className="crop-detail-farm">
          <span>FARM</span>

          <strong>🌱 {crop.Farm.name}</strong>
        </div>

        <div className="crop-detail-grid">
          <div>
            <span>Crop Name</span>
            <strong>{crop.cropName}</strong>
          </div>

          <div>
            <span>Variety</span>
            <strong>{crop.variety || "-"}</strong>
          </div>

          <div>
            <span>Planting Date</span>
            <strong>
              {crop.plantingDate
                ? new Date(crop.plantingDate).toLocaleDateString("id-ID")
                : "-"}
            </strong>
          </div>

          <div>
            <span>Harvest Date</span>
            <strong>
              {crop.harvestDate
                ? new Date(crop.harvestDate).toLocaleDateString("id-ID")
                : "-"}
            </strong>
          </div>

          <div>
            <span>Target Moisture</span>
            <strong>{crop.targetMoisture ?? "-"}</strong>
          </div>

          <div>
            <span>Target NDVI</span>
            <strong>{crop.targetNDVI ?? "-"}</strong>
          </div>

          <div>
            <span>Target Temperature</span>
            <strong>{crop.targetTemperature ?? "-"}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{crop.status || "-"}</strong>
          </div>
        </div>
      </div>

      <div className="crop-detail-footer">
        <button type="button" className="crop-delete-button" onClick={onDelete}>
          Delete
        </button>

        <button type="button" className="crop-edit-button" onClick={onEdit}>
          Edit Crop
        </button>
      </div>
    </div>
  );
};

export default CropDetail;
