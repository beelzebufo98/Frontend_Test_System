import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SectionsPage from './pages/SectionsPage';
import SectionTestsPage from './pages/SectionTestsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionTestsPage />,
  },
]);

const Application = () => {
  return <RouterProvider router={router} />;
};

export default Application;