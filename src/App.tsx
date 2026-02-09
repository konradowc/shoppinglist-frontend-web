import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ListsPage } from "./pages/ListsPage"
import { ErrorPage } from "./pages/ErrorPage"
import { AppProvider } from "./context/AppProvider";

export const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ListsPage />}
          />
          <Route
            path="*"
            element={<ErrorPage />}
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
