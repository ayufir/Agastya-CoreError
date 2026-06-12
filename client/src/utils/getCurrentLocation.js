// export const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject("Geolocation not supported by this browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => {
//         reject(
//           "Unable to retrieve location. Permission denied or error occurred."
//         );
//       }
//     );
//   });
// };
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Permission to access location was denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "The request to get your location timed out.";
            break;
          default:
            message = "An unknown error occurred while fetching location.";
            break;
        }
        console.error("Location fetch failed:", message);
        reject(message);
      }
    );
  });
};
