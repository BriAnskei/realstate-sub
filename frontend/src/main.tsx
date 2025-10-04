import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { ApplicationProvider } from "./context/ApplicationContext.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ApplicationProvider>
      <ThemeProvider>
        <UserProvider>
          <AppWrapper>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AppWrapper>
        </UserProvider>
      </ThemeProvider>
    </ApplicationProvider>
  </Provider>
);
