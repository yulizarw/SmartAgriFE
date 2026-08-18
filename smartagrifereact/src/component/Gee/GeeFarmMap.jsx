// import React, { useEffect } from "react";

// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// import L from "leaflet";

// import "leaflet/dist/leaflet.css";

// // =========================================
// // FIX DEFAULT LEAFLET ICON
// // =========================================

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // =========================================
// // AUTO CENTER
// // =========================================

// const MapCenter = ({ farms }) => {
//   const map = useMap();

//   useEffect(() => {
//     const validFarm = farms.find(
//       (farm) => farm.latitude !== null && farm.longitude !== null,
//     );

//     if (!validFarm) {
//       return;
//     }

//     map.setView([Number(validFarm.latitude), Number(validFarm.longitude)], 15);
//   }, [farms, map]);

//   return null;
// };

// // =========================================
// // MAP
// // =========================================

// const GeeFarmMap = ({ farms, getFarmGeeHistory, getFarmWeather }) => {
//   const defaultCenter = [-6.2, 106.8];
//   return (
//     <div className="gee-map-container">
//       <MapContainer
//         center={defaultCenter}
//         zoom={10}
//         scrollWheelZoom={true}
//         className="gee-leaflet-map"
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapCenter farms={farms} />

//         {farms.map((farm) => {
//           if (
//             farm.latitude === null ||
//             farm.longitude === null ||
//             farm.latitude === undefined ||
//             farm.longitude === undefined
//           ) {
//             return null;
//           }

//           const gee = getFarmGeeHistory(farm.id, farm.crop?.id);

//           const weather = getFarmWeather(farm.id);

//           return (
//             <Marker
//               key={farm.id}
//               position={[Number(farm.latitude), Number(farm.longitude)]}
//             >
//               <Popup>
//                 <div className="gee-map-popup">
//                   <strong>{farm.name}</strong>

//                   <span>🌱 {farm.crop?.name}</span>

//                   <hr />

//                   <div>
//                     NDVI:
//                     <strong>
//                       {" "}
//                       {gee?.ndvi ? Number(gee.ndvi).toFixed(2) : "-"}
//                     </strong>
//                   </div>

//                   <div>
//                     Temperature:
//                     <strong>
//                       {" "}
//                       {weather?.temperature
//                         ? `${Number(weather.temperature).toFixed(1)} °C`
//                         : "-"}
//                     </strong>
//                   </div>

//                   <div>
//                     Rain:
//                     <strong>
//                       {" "}
//                       {weather?.rain
//                         ? `${Number(weather.rain).toFixed(1)} mm`
//                         : "-"}
//                     </strong>
//                   </div>
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// };

// export default GeeFarmMap;
import React, { useEffect, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// =========================================
// FIX DEFAULT LEAFLET ICON
// =========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =========================================
// PARSE POLYGON
// =========================================

const getPolygonCoordinates = (polygon) => {
  if (!polygon) {
    return null;
  }

  try {
    // Kalau dari PostgreSQL sudah berupa object
    const geoJson = typeof polygon === "string" ? JSON.parse(polygon) : polygon;

    if (
      !geoJson ||
      geoJson.type !== "Polygon" ||
      !Array.isArray(geoJson.coordinates)
    ) {
      return null;
    }

    // GeoJSON:
    // [longitude, latitude]
    //
    // Leaflet:
    // [latitude, longitude]

    const coordinates = geoJson.coordinates[0];

    if (!coordinates || !coordinates.length) {
      return null;
    }

    return coordinates.map(([longitude, latitude]) => [
      Number(latitude),
      Number(longitude),
    ]);
  } catch (error) {
    console.error("Gagal membaca polygon farm:", error);

    return null;
  }
};

// =========================================
// AUTO CENTER
// =========================================

const MapCenter = ({ farms }) => {
  const map = useMap();

  useEffect(() => {
    const allCoordinates = [];

    farms.forEach((farm) => {
      const polygon = getPolygonCoordinates(farm.polygon);

      if (polygon) {
        allCoordinates.push(...polygon);
      }
    });

    // =====================================
    // CENTER BERDASARKAN POLYGON
    // =====================================

    if (allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates);

      map.fitBounds(bounds, {
        padding: [40, 40],
      });

      return;
    }

    // =====================================
    // FALLBACK KE LATITUDE / LONGITUDE
    // =====================================

    const validFarm = farms.find(
      (farm) =>
        farm.latitude !== null &&
        farm.longitude !== null &&
        farm.latitude !== undefined &&
        farm.longitude !== undefined,
    );

    if (!validFarm) {
      return;
    }

    map.setView([Number(validFarm.latitude), Number(validFarm.longitude)], 15);
  }, [farms, map]);

  return null;
};

// =========================================
// MAP
// =========================================

const GeeFarmMap = ({ farms, getFarmGeeHistory, getFarmWeather }) => {
  const defaultCenter = [-6.2, 106.8];

  return (
    <div className="gee-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom={true}
        className="gee-leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter farms={farms} />

        {farms.map((farm) => {
          // =====================================
          // POLYGON FARM
          // =====================================

          const polygonCoordinates = getPolygonCoordinates(farm.polygon);

          // =====================================
          // MARKER LOCATION
          // =====================================

          let markerPosition = null;

          if (
            farm.latitude !== null &&
            farm.longitude !== null &&
            farm.latitude !== undefined &&
            farm.longitude !== undefined
          ) {
            markerPosition = [Number(farm.latitude), Number(farm.longitude)];
          } else if (polygonCoordinates?.length) {
            // Kalau farm tidak punya latitude longitude,
            // ambil titik pertama polygon sebagai marker.

            markerPosition = polygonCoordinates[0];
          }

          // =====================================
          // DATA GEE
          // =====================================

          const gee = getFarmGeeHistory(farm.id, farm.crop?.id);

          // =====================================
          // DATA WEATHER
          // =====================================

          const weather = getFarmWeather(farm.id);

          return (
            <React.Fragment key={farm.id}>
              {/* =================================
                  FARM POLYGON
              ================================= */}

              {polygonCoordinates && (
                <Polygon
                  positions={polygonCoordinates}
                  pathOptions={{
                    color: "#2e7d32",
                    weight: 2,
                    fillColor: "#4caf50",
                    fillOpacity: 0.25,
                  }}
                >
                  <Popup>
                    <div className="gee-map-popup">
                      <strong>{farm.name}</strong>

                      {farm.crop?.name && <span>🌱 {farm.crop.name}</span>}

                      <hr />

                      <div>
                        NDVI:
                        <strong>
                          {" "}
                          {gee?.ndvi !== null && gee?.ndvi !== undefined
                            ? Number(gee.ndvi).toFixed(2)
                            : "-"}
                        </strong>
                      </div>

                      <div>
                        Temperature:
                        <strong>
                          {" "}
                          {weather?.temperature !== null &&
                          weather?.temperature !== undefined
                            ? `${Number(weather.temperature).toFixed(1)} °C`
                            : "-"}
                        </strong>
                      </div>

                      <div>
                        Rain:
                        <strong>
                          {" "}
                          {weather?.rain !== null && weather?.rain !== undefined
                            ? `${Number(weather.rain).toFixed(1)} mm`
                            : "-"}
                        </strong>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* =================================
                  FARM MARKER
              ================================= */}

              {markerPosition && (
                <Marker position={markerPosition}>
                  <Popup>
                    <div className="gee-map-popup">
                      <strong>{farm.name}</strong>

                      {farm.crop?.name && <span>🌱 {farm.crop.name}</span>}

                      <hr />

                      <div>
                        NDVI:
                        <strong>
                          {" "}
                          {gee?.ndvi !== null && gee?.ndvi !== undefined
                            ? Number(gee.ndvi).toFixed(2)
                            : "-"}
                        </strong>
                      </div>

                      <div>
                        Temperature:
                        <strong>
                          {" "}
                          {weather?.temperature !== null &&
                          weather?.temperature !== undefined
                            ? `${Number(weather.temperature).toFixed(1)} °C`
                            : "-"}
                        </strong>
                      </div>

                      <div>
                        Rain:
                        <strong>
                          {" "}
                          {weather?.rain !== null && weather?.rain !== undefined
                            ? `${Number(weather.rain).toFixed(1)} mm`
                            : "-"}
                        </strong>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GeeFarmMap;