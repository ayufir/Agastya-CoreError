// // Login API Service
// // ⚠️ UPDATE THIS WITH YOUR ACTUAL API URL
// const API_LOGIN_URL = import.meta.env.VITE_API_URL || 'https://your-api-endpoint.com/login';

// export const loginService = async (username, password) => {
//   try {
//     console.log('🔐 Login attempt:', { username });
//     console.log('📍 API URL:', API_LOGIN_URL);

//     // For Demo/Testing - Remove this after connecting to real API
//     if (API_LOGIN_URL.includes('your-api-endpoint')) {
//       console.warn('⚠️ Using demo mode - Please update API URL in loginService.js');
//       // Demo: Accept admin@gmail.com / 123456
//       if (username === "admin@gmail.com" && password === "123456") {
//         return {
//           success: true,
//           message: "Demo login successful",
//           data: { username, role: "admin" }
//         };
//       } else {
//         return {
//           success: false,
//           message: "Demo: Use admin@gmail.com / 123456",
//           data: null
//         };
//       }
//     }

//     const response = await fetch(API_LOGIN_URL, {
//       method: 'POST',
//       mode: 'cors', // Enable CORS
//       credentials: 'include', // Send cookies if needed
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         username: username,
//         password: password
//       })
//     });

//     console.log('✅ API Response Status:', response.status);

//     // Handle non-200 status codes
//     if (!response.ok && response.status !== 200) {
//       const text = await response.text();
//       console.error('❌ API Error Response:', text);
//       return {
//         success: false,
//         message: `Server error: ${response.status}`,
//         data: null
//       };
//     }

//     const data = await response.json();
//     console.log('📦 API Response Data:', data);

//     // Check for success - handle multiple response formats
//     const isSuccess = 
//       response.ok && 
//       (
//         data.success === true || 
//         data.success === "true" || 
//         data.status === true || 
//         data.status === "true" ||
//         data.message === "success" ||
//         data.code === 200 ||
//         data.code === "200" ||
//         data.authenticated === true
//       );

//     if (isSuccess) {
//       console.log('✅ Login Successful');
//       return {
//         success: true,
//         message: data.message || "Login successful",
//         data: data.data || data.user || { username }
//       };
//     } else {
//       console.log('❌ Login Failed');
//       return {
//         success: false,
//         message: data.message || data.error || "Invalid credentials",
//         data: null
//       };
//     }

//   } catch (error) {
//     console.error('❌ Fetch Error:', error);
//     console.error('Error details:', error.message);

//     if (error.message === 'Failed to fetch') {
//       return {
//         success: false,
//         message: 'CORS Error or API unreachable. Check:\n1. API URL is correct\n2. API has CORS enabled\n3. API server is running',
//         data: null
//       };
//     }

//     return {
//       success: false,
//       message: error.message || "Network error. Please check your connection.",
//       data: null
//     };
//   }
// };





















// services/loginService.js
const API_BASE_URL = "https://banker-backend-8ttk.onrender.com/api/auth";

export const loginService = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

export const logoutService = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};