import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { RouterProvider } from "react-router/dom";
import router from "./router/router";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-500">
            Loading…
          </div>
        }
        persistor={persistor}
      >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
