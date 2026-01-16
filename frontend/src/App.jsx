import { BrowserRouter, Routes, Route } from 'react-router'
import { Login } from './Login'
import { HomeLayout } from './HomeLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursesDisplayLayout } from './CoursesDisplayLayout';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function App() {
  return <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<CoursesDisplayLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </>
}