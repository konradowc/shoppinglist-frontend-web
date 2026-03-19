import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ListsPage } from "./pages/ListsPage.js"
import { ErrorPage } from "./pages/ErrorPage.js"
import { AppProvider } from "./context/AppProvider.js"
import { AuthProvider } from "./context/AuthProvider.js"

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SseInitializer } from "./services/initializers/SseInitializer.js"

// make React Query Client
const queryClient = new QueryClient();

// make Mantine theme
const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md', // roundness of edges
});

// make the app
export const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <AppProvider>
        <AuthProvider>
          <MantineProvider theme={theme}>
            <SseInitializer/>
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
