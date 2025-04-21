import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Page } from "./Page/Page";
import { AppStateProvider } from "./State/AppStateContext";
import { Auth } from "./Auth/Auth";
import { Private } from "./Auth/Private";
import { MainLayout } from "./Layout Components/MainLayout";
import { PageContainer } from "./Page/PageContainer";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <AppStateProvider>
        <Private component={<MainLayout />} />
      </AppStateProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <AppStateProvider>
            <PageContainer>
              <Page />
            </PageContainer>
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
