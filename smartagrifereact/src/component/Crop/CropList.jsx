import React from "react";

const CropList = ({ crops, farms, loading, onAdd, onView, onEdit, listCrop}) => {
  const getFarmName = (farmId) => {
    const farm = farms.find((item) => Number(item.id) === Number(farmId));

    return farm?.name || "No Farm";
  };

  if (loading) {
    return (
      <section className="crop-list-card">
        <div className="crop-list-header">
          <div>
            <span>REGISTERED CROPS</span>

            <h2>Crop Management</h2>
          </div>
        </div>

        <div className="crop-empty">Loading crop...</div>
      </section>
    );
  }

  return (
    <section className="crop-list-card">
      <div className="crop-list-header">
        <div>
          <span>REGISTERED CROPS</span>

          <h2>Crop Management</h2>
        </div>

        <strong>{crops.length} crops</strong>
      </div>

      {listCrop.length === 0 ? (
        <div className="crop-empty">
          <div className="crop-empty-icon">🌱</div>

          <h3>Belum ada tanaman</h3>

          <p>Tambahkan tanaman pertama ke salah satu farm kamu.</p>

          <button type="button" onClick={onAdd}>
            + Add Crop
          </button>
        </div>
      ) : (
        <div className="crop-table-wrapper">
          <table className="crop-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Farm</th>
                <th>Variety</th>
                <th>Planting</th>
                <th>Harvest</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {listCrop.map((crop) => (
                <tr key={crop.id}>
                  <td>
                    <strong>{crop.cropName}</strong>
                  </td>

                  {/* <td>{getFarmName(crop.farmId)}</td> */}
                  <td>{crop.Farm.name}</td>

                  <td>{crop.variety || "-"}</td>

                  <td>
                    {crop.plantingDate
                      ? new Date(crop.plantingDate).toLocaleDateString("id-ID")
                      : "-"}
                  </td>

                  <td>
                    {crop.harvestDate
                      ? new Date(crop.harvestDate).toLocaleDateString("id-ID")
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`crop-status crop-status-${String(
                        crop.status || "",
                      ).toLowerCase()}`}
                    >
                      {crop.status || "-"}
                    </span>
                  </td>

                  <td>
                    <div className="crop-actions">
                      <button type="button" onClick={() => onView(crop)}>
                        View
                      </button>

                      <button type="button" onClick={() => onEdit(crop)}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CropList;
