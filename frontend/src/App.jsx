import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursesDisplayLayout } from './pages/home/pages/courses-page';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Login } from './pages/login'
import { Design } from './pages/design';
import { HomeLayout } from './pages/home';
import { RequireAuth } from './RequireAuth';
import { Course } from './pages/home/pages/course';
import { Stream } from './pages/home/pages/course/pages/stream';
import { PeopleDisplay } from './pages/home/pages/course/pages/people';

const TWO_MINUTES = 2 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TWO_MINUTES,      // data is fresh for 2 min
      gcTime: FIVE_MINUTES,        // keep cache around after unused
      retry: false,                // don't retry on errors (esp auth)
      refetchOnWindowFocus: false, // avoid surprise refetches
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
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<CoursesDisplayLayout />} />
              <Route path="/courses/:courseId" element={<Course />}>
                <Route index element={<Stream />} />
                <Route path="people" element={<PeopleDisplay />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </>
}