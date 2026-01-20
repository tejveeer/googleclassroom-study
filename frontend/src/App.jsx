import { BrowserRouter, Routes, Route } from 'react-router'
import { Login } from './pages/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursesDisplayLayout } from './CoursesDisplayLayout';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Design } from './Design';
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
          <Route path="login" element={<Login />} />
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<CoursesDisplayLayout />} />
            <Route path="design" element={<Design />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </>
}