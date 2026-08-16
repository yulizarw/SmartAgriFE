import React, { useEffect, useState } from "react";

import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchFarms,
  addFarm,
  updateFarm,
  deleteFarm,
} from "../../store/action/farmAction";

import "leaflet/dist/leaflet.css";

// import "../screen/css/farmOverview.css";

/*
|--------------------------------------------------------------------------
| FIX LEAFLET MARKER
|--------------------------------------------------------------------------
*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/*
|--------------------------------------------------------------------------
| DEFAULT POLYGON
|--------------------------------------------------------------------------
*/

const DEFAULT_POLYGON = JSON.stringify(
  {
    type: "Polygon",
    coordinates: [
      [
        [107.6837018, -6.3211316],
        [107.68400017017919, -6.321336835159289],
        [107.68406116486742, -6.321266815947579],
        [107.68376279468822, -6.32106158078829],
        [107.6837018, -6.3211316],
      ],
    ],
  },
  null,
  2,
);

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const FarmOverview = () => {
  const dispatch = useDispatch();

  const farms = useSelector((state) => state.farmReducers?.farms || []);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showDetail, setShowDetail] = useState(false);

  const [selectedFarm, setSelectedFarm] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    polygon: DEFAULT_POLYGON,
    latitude: "",
    longitude: "",
    address: "",
    status: true,
  });

  /*
    |--------------------------------------------------------------------------
    | GET FARMS
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    dispatch(fetchFarms());
  }, [dispatch]);

  /*
    |--------------------------------------------------------------------------
    | FORM CHANGE
    |--------------------------------------------------------------------------
    */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*
    |--------------------------------------------------------------------------
    | OPEN ADD
    |--------------------------------------------------------------------------
    */

  const handleAdd = () => {
    setEditMode(false);

    setSelectedFarm(null);

    setFormData({
      name: "",
      area: "",
      polygon: DEFAULT_POLYGON,
      latitude: "",
      longitude: "",
      address: "",
      status: true,
    });

    setShowModal(true);
  };

  /*
    |--------------------------------------------------------------------------
    | OPEN EDIT
    |--------------------------------------------------------------------------
    */

  const handleEdit = (farm) => {
    setEditMode(true);

    setSelectedFarm(farm);

    setFormData({
      name: farm.name || "",
      area: farm.area || "",
      polygon: JSON.stringify(farm.polygon, null, 2),
      latitude: farm.latitude || "",
      longitude: farm.longitude || "",
      address: farm.address || "",
      status: farm.status ?? true,
    });

    setShowModal(true);
  };

  /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

  const handleSubmit = async (e) => {
    e.preventDefault();

    let polygonData;

    try {
      polygonData = JSON.parse(formData.polygon);
    } catch (error) {
      alert("Format polygon JSON tidak valid.");

      return;
    }

    const payload = {
      name: formData.name,

      area: Number(formData.area),

      polygon: polygonData,

      latitude: Number(formData.latitude),

      longitude: Number(formData.longitude),

      address: formData.address,

      status: formData.status,
    };

    let result;

    if (editMode) {
      result = await dispatch(updateFarm(selectedFarm.id, payload));
    } else {
      result = await dispatch(addFarm(payload));
    }

    if (result?.success) {
      setShowModal(false);

      dispatch(fetchFarms());
    } else {
      alert(editMode ? "Gagal mengubah farm." : "Gagal menambahkan farm.");
    }
  };

  /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

  const handleDelete = async (farm) => {
    const confirmDelete = window.confirm(`Hapus farm "${farm.name}"?`);

    if (!confirmDelete) {
      return;
    }

    const result = await dispatch(deleteFarm(farm.id));

    if (!result?.success) {
      alert("Gagal menghapus farm.");
    }
  };

  /*
    |--------------------------------------------------------------------------
    | DETAIL
    |--------------------------------------------------------------------------
    */

  const handleDetail = (farm) => {
    setSelectedFarm(farm);

    setShowDetail(true);
  };

  /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

  const filteredFarms = farms.filter((farm) =>
    farm.name?.toLowerCase().includes(search.toLowerCase()),
  );

  /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

  return (
    <div className="farm-page">
      {/* =================================================
                PAGE HEADER
            ================================================= */}

      <div className="farm-page-header">
        <div>
          <span className="page-eyebrow">FARM MANAGEMENT</span>

          <h1>Farm Overview</h1>

          <p>Kelola lahan pertanian, lokasi dan informasi farm SmartAgri.</p>
        </div>

        <button className="add-farm-button" onClick={handleAdd}>
          <span>+</span>
          Add New Farm
        </button>
      </div>

      {/* =================================================
                STATISTICS
            ================================================= */}

      <div className="farm-stat-grid">
        <div className="farm-stat-card">
          <span>TOTAL FARM</span>

          <strong>{farms.length}</strong>

          <small>Registered farm</small>
        </div>

        <div className="farm-stat-card">
          <span>ACTIVE FARM</span>

          <strong>{farms.filter((farm) => farm.status).length}</strong>

          <small>Currently active</small>
        </div>

        <div className="farm-stat-card">
          <span>TOTAL AREA</span>

          <strong>
            {farms
              .reduce((total, farm) => total + Number(farm.area || 0), 0)
              .toFixed(2)}
          </strong>

          <small>Hectare</small>
        </div>

        <div className="farm-stat-card">
          <span>LOCATION</span>

          <strong>📍</strong>

          <small>Geo-enabled</small>
        </div>
      </div>

      {/* =================================================
                TABLE CARD
            ================================================= */}

      <div className="farm-table-card">
        <div className="farm-table-toolbar">
          <div>
            <h2>Registered Farms</h2>

            <span>{filteredFarms.length} farm ditemukan</span>
          </div>

          <div className="farm-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search farm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="farm-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>FARM</th>

                <th>AREA</th>

                <th>LOCATION</th>

                <th>COORDINATE</th>

                <th>STATUS</th>

                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredFarms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    🌱
                    <strong>Belum ada farm</strong>
                    <span>Tambahkan farm pertama Anda.</span>
                  </td>
                </tr>
              ) : (
                filteredFarms.map((farm) => (
                  <tr key={farm.id}>
                    {/* FARM */}

                    <td>
                      <div className="farm-name-cell">
                        <div className="farm-mini-icon">🌱</div>

                        <div>
                          <strong>{farm.name}</strong>

                          <span>Farm ID #{farm.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* AREA */}

                    <td>
                      <strong>{farm.area}</strong>

                      <span className="table-unit">ha</span>
                    </td>

                    {/* ADDRESS */}

                    <td>
                      <div className="address-cell">
                        📍
                        <span>{farm.address || "-"}</span>
                      </div>
                    </td>

                    {/* COORDINATE */}

                    <td>
                      <span className="coordinate-cell">
                        {Number(farm.latitude).toFixed(6)},
                        {Number(farm.longitude).toFixed(6)}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={
                          farm.status
                            ? "farm-status active"
                            : "farm-status inactive"
                        }
                      >
                        <i />

                        {farm.status ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td>
                      <div className="farm-actions">
                        <button
                          className="action-view"
                          onClick={() => handleDetail(farm)}
                        >
                          View
                        </button>

                        <button
                          className="action-edit"
                          onClick={() => handleEdit(farm)}
                        >
                          Edit
                        </button>

                        <button
                          className="action-delete"
                          onClick={() => handleDelete(farm)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

      {showModal && (
        <div className="farm-modal-overlay">
          <div className="farm-modal">
            <div className="modal-header">
              <div>
                <span>FARM MANAGEMENT</span>

                <h2>{editMode ? "Edit Farm" : "Add New Farm"}</h2>
              </div>

              <button onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Farm Name</label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Smart Farm Subang"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Area (ha)</label>

                  <input
                    name="area"
                    type="number"
                    step="0.01"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="0.40"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Latitude</label>

                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="-6.3211316"
                  />
                </div>

                <div className="input-group">
                  <label>Longitude</label>

                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="107.6837018"
                  />
                </div>

                <div className="input-group full">
                  <label>Address</label>

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Subang, Jawa Barat"
                  />
                </div>

                <div className="input-group full">
                  <label>Polygon GeoJSON</label>

                  <textarea
                    name="polygon"
                    value={formData.polygon}
                    onChange={handleChange}
                    rows="8"
                    required
                  />

                  <small>Format harus berupa GeoJSON Polygon.</small>
                </div>

                <div className="input-group">
                  <label>Status</label>

                  <label className="status-switch">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                    />

                    <span>{formData.status ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  {editMode ? "Save Changes" : "Create Farm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
                DETAIL MODAL
            ================================================= */}

      {showDetail && selectedFarm && (
        <FarmDetailModal
          farm={selectedFarm}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| FARM DETAIL
|--------------------------------------------------------------------------
*/

const FarmDetailModal = ({ farm, onClose }) => {
  /*
    |--------------------------------------------------------------------------
    | CONVERT GEOJSON
    |--------------------------------------------------------------------------
    */

  const polygonCoordinates =
    farm.polygon?.coordinates?.[0]?.map((coordinate) => [
      coordinate[1],
      coordinate[0],
    ]) || [];

  const center = polygonCoordinates.length
    ? polygonCoordinates[0]
    : [Number(farm.latitude), Number(farm.longitude)];

  const openMap = () => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${farm.latitude}&mlon=${farm.longitude}#map=18/${farm.latitude}/${farm.longitude}`,
      "_blank",
    );
  };

  return (
    <div className="farm-modal-overlay">
      <div className="farm-detail-modal">
        <div className="modal-header">
          <div>
            <span>FARM DETAILS</span>

            <h2>{farm.name}</h2>
          </div>

          <button onClick={onClose}>×</button>
        </div>

        <div className="farm-detail-content">
          {/* MAP */}

          <div className="farm-map">
            <MapContainer
              center={center}
              zoom={18}
              style={{
                height: "420px",
                width: "100%",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {polygonCoordinates.length > 0 && (
                <Polygon positions={polygonCoordinates} />
              )}

              {farm.latitude && farm.longitude && (
                <Marker
                  position={[Number(farm.latitude), Number(farm.longitude)]}
                >
                  <Popup>
                    <strong>{farm.name}</strong>

                    <br />

                    {farm.address}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* INFO */}

          <div className="farm-detail-info">
            <div className="detail-info-item">
              <span>FARM NAME</span>

              <strong>{farm.name}</strong>
            </div>

            <div className="detail-info-item">
              <span>AREA</span>

              <strong>{farm.area} ha</strong>
            </div>

            <div className="detail-info-item">
              <span>ADDRESS</span>

              <strong>{farm.address || "-"}</strong>
            </div>

            <div className="detail-info-item">
              <span>LATITUDE</span>

              <strong>{farm.latitude}</strong>
            </div>

            <div className="detail-info-item">
              <span>LONGITUDE</span>

              <strong>{farm.longitude}</strong>
            </div>

            <div className="detail-info-item">
              <span>STATUS</span>

              <strong className={farm.status ? "text-active" : "text-inactive"}>
                {farm.status ? "ACTIVE" : "INACTIVE"}
              </strong>
            </div>

            <button className="osm-button" onClick={openMap}>
              📍 Open in OpenStreetMap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmOverview;
