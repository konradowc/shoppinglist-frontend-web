import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ListsPage } from "./pages/ListsPage"
import { ErrorPage } from "./pages/ErrorPage"
import { AppProvider } from "./context/AppProvider"
import { AuthProvider } from "./context/AuthProvider"

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient();

export const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <AppProvider>
        <AuthProvider>
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
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
