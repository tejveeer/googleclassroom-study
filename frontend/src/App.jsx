import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursesDisplayLayout } from './pages/home/pages/courses';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Login } from './pages/login'
import { Design } from './pages/design';
import { HomeLayout } from './pages/home';

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
          <Route path="design" element={<Design />} />
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