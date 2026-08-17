import React, { useMemo, useState } from "react";

import "./css/FarmList.css";

const FarmList = ({loading, onView, onEdit, onDelete, onAdd, farmList }) => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

  const filteredFarms = useMemo(() => {
    return farmList.filter((farm) => {
      const searchMatch =
        !search ||
        farm.name?.toLowerCase().includes(search.toLowerCase()) ||
        farm.address?.toLowerCase().includes(search.toLowerCase());

      const isActive = farm.status === true || farm.status === "ACTIVE";

      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      return searchMatch && statusMatch;
    });
  }, [farmList, search, statusFilter]);

  /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

  const getStatus = (farm) => {
    return farm.status === true || farm.status === "ACTIVE";
  };

  return (
    <section className="farm-list-section">
      {/* =====================================================
                LIST HEADER
            ===================================================== */}

      <div className="farm-list-header">
        <div>
          <span>YOUR FARMS</span>

          <h2>Farm Locations</h2>
        </div>

        <div className="farm-list-tools">
          <div className="farm-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search farm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* =====================================================
                LOADING
            ===================================================== */}

      {loading && (
        <div className="farm-list-loading">
          <div className="farm-spinner" />

          <span>Loading farms...</span>
        </div>
      )}

      {/* =====================================================
                EMPTY
            ===================================================== */}

      {!loading && filteredFarms.length === 0 && (
        <div className="farm-empty">
          <div className="farm-empty-icon">🌱</div>

          <h3>Belum ada farm</h3>

          <p>Tambahkan farm pertama untuk mulai menggunakan SmartAgri.</p>

          <button type="button" onClick={onAdd}>
            + Add New Farm
          </button>
        </div>
      )}

      {/* =====================================================
                TABLE
            ===================================================== */}

      {!loading && filteredFarms.length > 0 && (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>FARM</th>

                <th>AREA</th>

                <th>LOCATION</th>

                <th>STATUS</th>

                <th>MAP</th>

                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredFarms.map((farm) => {
                const active = getStatus(farm);

                return (
                  <tr key={farm.id}>
                    {/* FARM */}

                    <td>
                      <div className="farm-name-cell">
                        <div className="farm-row-icon">🌱</div>

                        <div>
                          <strong>{farm.name}</strong>

                          <span>Farm #{farm.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* AREA */}

                    <td>
                      <strong>{Number(farm.area || 0).toLocaleString()}</strong>

                      <span className="farm-unit">m²</span>
                    </td>

                    {/* LOCATION */}

                    <td>
                      <div className="farm-location-cell">
                        <span>📍</span>

                        <span>
                          {farm.address ||
                            (farm.latitude && farm.longitude
                              ? `${farm.latitude}, ${farm.longitude}`
                              : "Location not set")}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={
                          active ? "farm-status active" : "farm-status inactive"
                        }
                      >
                        <span />

                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* MAP */}

                    <td>
                      {farm.polygon ? (
                        <span className="mapped-badge">🗺️ Mapped</span>
                      ) : (
                        <span className="not-mapped">Not mapped</span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td>
                      <div className="farm-actions">
                        <button
                          type="button"
                          className="view"
                          title="View"
                          onClick={() => onView(farm)}
                        >
                          👁
                        </button>

                        <button
                          type="button"
                          className="edit"
                          title="Edit"
                          onClick={() => onEdit(farm)}
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="delete"
                          title="Delete"
                          onClick={() => onDelete(farm)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default FarmList;
