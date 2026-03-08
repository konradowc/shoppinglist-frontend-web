import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ListsPage } from "./pages/ListsPage"
import { ErrorPage } from "./pages/ErrorPage"
import { AppProvider } from "./context/AppProvider"
import { AuthProvider } from "./context/AuthProvider"

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
export const queryClient = new QueryClient(); // TO-DO: exporting this

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md', // roundness of edges
});

export const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <AppProvider>
        <AuthProvider>
          <MantineProvider theme={theme}>
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
          </MantineProvider> 
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
