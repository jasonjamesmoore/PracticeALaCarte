import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Page } from "./Page/Page";
import { AppStateProvider } from "./State/AppStateContext";
import { Auth } from "./Auth/Auth";
import { Private } from "./Auth/Private";
import { MainLayout } from "./Layout Components/MainLayout";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Private component={<MainLayout />} />,
    children: [
      {
        path: "/",
        element: (
          <AppStateProvider>
            <Page />
          </AppStateProvider>
        ),
      },
      {
        path: "/:id",
        element: (
          <AppStateProvider>
            <Page />
          </AppStateProvider>
        ),
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
