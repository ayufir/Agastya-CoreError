// import React, { useEffect, useMemo, useState } from "react";

// const normalizeCoordinate = (value = "") => {
//   const parsed = Number.parseFloat(String(value).trim());
//   return Number.isFinite(parsed) ? String(parsed) : "";
// };

// const normalizeMapMode = (value = "") =>
//   String(value).toLowerCase() === "satellite" ? "satellite" : "roadmap";

// const resolveCoordinates = ({ coordinates = "", latitude = "", longitude = "" }) => {
//   if (coordinates) {
//     const [lat = "", lng = ""] = String(coordinates)
//       .split(",")
//       .map((item) => item.trim());

//     return {
//       latitude: normalizeCoordinate(lat),
//       longitude: normalizeCoordinate(lng),
//     };
//   }

//   return {
//     latitude: normalizeCoordinate(latitude),
//     longitude: normalizeCoordinate(longitude),
//   };
// };

// const buildGoogleEmbedMapUrl = (latitude, longitude, mapMode) =>
//   `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&t=${
//     mapMode === "satellite" ? "k" : "m"
//   }&output=embed`;

// const buildStaticMapCandidates = (latitude, longitude, mapMode) => {
//   const lat = encodeURIComponent(latitude);
//   const lng = encodeURIComponent(longitude);
//   const yandexLayer = mapMode === "satellite" ? "sat,skl" : "map";

//   return [
//     `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=15&size=650,350&l=${yandexLayer}&pt=${lng},${lat},pm2rdm`,
//     `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=900x420&markers=${lat},${lng},red-pushpin`,
//   ];
// };

// const buildFallbackMap = (latitude, longitude, mapMode) => {
//   const label = mapMode === "satellite" ? "Satellite" : "Road";
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="900" height="420">
//       <rect width="100%" height="100%" fill="white" />
//       <rect x="8" y="8" width="884" height="404" fill="#f8fafc" stroke="#1f2937" stroke-width="2" />
//       <circle cx="450" cy="185" r="14" fill="#dc2626" />
//       <text x="450" y="235" text-anchor="middle" font-family="Arial" font-size="22" fill="#111827">
//         ${latitude}, ${longitude}
//       </text>
//       <text x="450" y="270" text-anchor="middle" font-family="Arial" font-size="18" fill="#6b7280">
//         ${label} map preview unavailable
//       </text>
//     </svg>
//   `;

//   return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
// };

// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("location-map-media-style")
// ) {
//   const styleTag = document.createElement("style");
//   styleTag.id = "location-map-media-style";
//   styleTag.textContent = `
//     .location-map-screen {
//       display: block;
//     }

//     .location-map-print {
//       display: none;
//     }

//     @media print {
//       .location-map-screen {
//         display: none !important;
//       }

//       .location-map-print {
//         display: block !important;
//       }
//     }
//   `;
//   document.head.appendChild(styleTag);
// }

// const StaticLocationMap = ({
//   coordinates,
//   latitude,
//   longitude,
//   mapMode = "roadmap",
//   title = "Location map",
//   className = "",
//   style,
//   emptyMessage = "Coordinates not available",
// }) => {
//   const resolved = useMemo(
//     () => resolveCoordinates({ coordinates, latitude, longitude }),
//     [coordinates, latitude, longitude]
//   );
//   const normalizedMapMode = normalizeMapMode(mapMode);
//   const { latitude: safeLatitude, longitude: safeLongitude } = resolved;
//   const embedUrl =
//     safeLatitude && safeLongitude
//       ? buildGoogleEmbedMapUrl(safeLatitude, safeLongitude, normalizedMapMode)
//       : "";
//   const staticCandidates =
//     safeLatitude && safeLongitude
//       ? [
//           ...buildStaticMapCandidates(
//             safeLatitude,
//             safeLongitude,
//             normalizedMapMode
//           ),
//           buildFallbackMap(safeLatitude, safeLongitude, normalizedMapMode),
//         ]
//       : [];

//   const [candidateIndex, setCandidateIndex] = useState(0);

//   useEffect(() => {
//     setCandidateIndex(0);
//   }, [safeLatitude, safeLongitude, normalizedMapMode]);

//   if (!safeLatitude || !safeLongitude) {
//     return (
//       <div className={className} style={style}>
//         {emptyMessage}
//       </div>
//     );
//   }

//   const staticMapUrl =
//     staticCandidates[
//       Math.min(candidateIndex, Math.max(staticCandidates.length - 1, 0))
//     ];

//   return (
//     <div
//       data-location-map='true'
//       data-latitude={safeLatitude}
//       data-longitude={safeLongitude}
//       data-map-mode={normalizedMapMode}
//     >
//       <iframe
//         src={embedUrl}
//         title={title}
//         loading='lazy'
//         allowFullScreen
//         className={`location-map-screen ${className}`.trim()}
//         style={style}
//         data-map-iframe='true'
//       />
//       <img
//         src={staticMapUrl}
//         alt={title}
//         title={title}
//         loading='eager'
//         referrerPolicy='no-referrer'
//         crossOrigin='anonymous'
//         className={`location-map-print ${className}`.trim()}
//         style={style}
//         onError={() => {
//           setCandidateIndex((current) =>
//             current < staticCandidates.length - 1 ? current + 1 : current
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default StaticLocationMap;


import React, { useEffect, useMemo, useState } from "react";

const normalizeCoordinate = (value = "") => {
  const parsed = Number.parseFloat(String(value).trim());
  return Number.isFinite(parsed) ? String(parsed) : "";
};

const resolveCoordinates = ({ coordinates = "", latitude = "", longitude = "" }) => {
  if (coordinates) {
    const [lat = "", lng = ""] = String(coordinates)
      .split(",")
      .map((item) => item.trim());

    return {
      latitude: normalizeCoordinate(lat),
      longitude: normalizeCoordinate(lng),
    };
  }

  return {
    latitude: normalizeCoordinate(latitude),
    longitude: normalizeCoordinate(longitude),
  };
};

const buildStaticMapUrl = (latitude, longitude) =>
  `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=900x420&markers=${latitude},${longitude},red-pushpin`;

const buildEmbedMapUrl = (latitude, longitude) =>
  `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;

const buildFallbackMap = (latitude, longitude) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="420">
      <rect width="100%" height="100%" fill="white" />
      <rect x="8" y="8" width="884" height="404" fill="#f8fafc" stroke="#1f2937" stroke-width="2" />
      <circle cx="450" cy="185" r="14" fill="#dc2626" />
      <text x="450" y="235" text-anchor="middle" font-family="Arial" font-size="22" fill="#111827">
        ${latitude}, ${longitude}
      </text>
      <text x="450" y="270" text-anchor="middle" font-family="Arial" font-size="18" fill="#6b7280">
        Static map preview unavailable
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("location-map-media-style")
) {
  const styleTag = document.createElement("style");
  styleTag.id = "location-map-media-style";
  styleTag.textContent = `
    .location-map-screen {
      display: block;
    }

    .location-map-print {
      display: none;
    }

    @media print {
      .location-map-screen {
        display: block !important;
      }

      .location-map-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleTag);
}

const StaticLocationMap = ({
  coordinates,
  latitude,
  longitude,
  title = "Location map",
  className = "",
  style,
  emptyMessage = "Coordinates not available",
}) => {
  const resolved = useMemo(
    () => resolveCoordinates({ coordinates, latitude, longitude }),
    [coordinates, latitude, longitude]
  );
  const { latitude: safeLatitude, longitude: safeLongitude } = resolved;
  const embedUrl =
    safeLatitude && safeLongitude
      ? buildEmbedMapUrl(safeLatitude, safeLongitude)
      : "";
  const mapUrl =
    safeLatitude && safeLongitude
      ? buildStaticMapUrl(safeLatitude, safeLongitude)
      : "";
  const fallbackUrl =
    safeLatitude && safeLongitude
      ? buildFallbackMap(safeLatitude, safeLongitude)
      : "";
  const [src, setSrc] = useState(mapUrl);

  useEffect(() => {
    setSrc(mapUrl);
  }, [mapUrl]);

  if (!safeLatitude || !safeLongitude) {
    return (
      <div className={className} style={style}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      data-location-map="true"
      data-latitude={safeLatitude}
      data-longitude={safeLongitude}
      data-static-map-url={mapUrl}
      data-fallback-map-url={fallbackUrl}
    >
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
        className={`location-map-screen ${className}`.trim()}
        style={style}
        data-map-iframe="true"
      />
      <img
        src={src}
        alt={title}
        title={title}
        loading="eager"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`location-map-print ${className}`.trim()}
        style={style}
        onError={() => {
          if (fallbackUrl && src !== fallbackUrl) {
            setSrc(fallbackUrl);
          }
        }}
      />
    </div>
  );
};

export default StaticLocationMap;
