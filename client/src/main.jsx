import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./context/LanguageContext.jsx";

console.log(
  "%c💻 Developed by: Ayush Shrivastava", 
  "color: #6366f1; font-weight: bold; font-size: 13px; font-family: sans-serif; padding: 2px 4px;"
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </Provider>
);
