import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: '/',
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
