import React from "react";

const CropForm = ({
  form,
  setForm,
  farmList,
  saving,
  editingCrop,
  onSubmit,
  onClose,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="crop-form" onSubmit={onSubmit}>
      <div className="crop-form-header">
        <div>
          <span>CROP MANAGEMENT</span>

          <h2>{editingCrop ? "Edit Crop" : "Add New Crop"}</h2>
        </div>

        <button type="button" onClick={onClose} disabled={saving}>
          ×
        </button>
      </div>

      <div className="crop-form-body">
        {/* FARM */}

        <div className="crop-form-group full">
          <label>Farm *</label>

          <select
            name="farmId"
            value={form.farmId}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Farm --</option>

            {farmList.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>

          <small>Pilih lahan tempat tanaman ini ditanam.</small>
        </div>

        {/* CROP NAME */}

        <div className="crop-form-group">
          <label>Crop Name *</label>

          <input
            type="text"
            name="cropName"
            value={form.cropName}
            onChange={handleChange}
            placeholder="Contoh: Padi"
            required
          />
        </div>

        {/* VARIETY */}

        <div className="crop-form-group">
          <label>Variety</label>

          <input
            type="text"
            name="variety"
            value={form.variety}
            onChange={handleChange}
            placeholder="Contoh: IR64"
          />
        </div>

        {/* PLANTING DATE */}

        <div className="crop-form-group">
          <label>Planting Date *</label>

          <input
            type="date"
            name="plantingDate"
            value={form.plantingDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* HARVEST DATE */}

        <div className="crop-form-group">
          <label>Harvest Date</label>

          <input
            type="date"
            name="harvestDate"
            value={form.harvestDate}
            onChange={handleChange}
          />
        </div>

        {/* TARGET MOISTURE */}

        <div className="crop-form-group">
          <label>Target Soil Moisture</label>

          <input
            type="number"
            name="targetMoisture"
            value={form.targetMoisture}
            onChange={handleChange}
            placeholder="Contoh: 60"
            step="any"
          />

          <small>Target kelembapan tanah.</small>
        </div>

        {/* TARGET NDVI */}

        <div className="crop-form-group">
          <label>Target NDVI</label>

          <input
            type="number"
            name="targetNDVI"
            value={form.targetNDVI}
            onChange={handleChange}
            placeholder="Contoh: 0.7"
            step="0.01"
            min="0"
            max="1"
          />
        </div>

        {/* TEMPERATURE */}

        <div className="crop-form-group">
          <label>Target Temperature</label>

          <input
            type="number"
            name="targetTemperature"
            value={form.targetTemperature}
            onChange={handleChange}
            placeholder="Contoh: 28"
            step="any"
          />

          <small>Target suhu tanaman.</small>
        </div>

        {/* STATUS */}

        <div className="crop-form-group">
          <label>Status</label>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Growing">Growing</option>

            <option value="Harvested">Harvested</option>

            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="crop-form-footer">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="crop-button-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || !form.farmId}
          className="crop-button-primary"
        >
          {saving ? "Saving..." : editingCrop ? "Update Crop" : "Save Crop"}
        </button>
      </div>
    </form>
  );
};

export default CropForm;
