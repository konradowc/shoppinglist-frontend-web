import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ListsPage } from "./pages/ListsPage"
import { ErrorPage } from "./pages/ErrorPage"

export const App = () => {

  return (
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
  );
}
