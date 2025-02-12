// import { Page } from "./Page/Page";
// import { AppStateProvider } from "./State/AppStateContext";
// import { Route, Routes } from "react-router-dom";
// import { Auth } from "./Auth/Auth";
// import { Private } from "./Auth/Private";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';


function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <Router />
    </MantineProvider>
  );
    // <Routes>
    //   <Route path="/auth" element={<Auth />} />
    //   <Route
    //     path="/:id"
    //     element={
    //       <Private
    //         component={
    //           <AppStateProvider>
    //             <Page />
    //           </AppStateProvider>
    //         }
    //       />
    //     }
    //   />
    //   <Route
    //     path="/"
    //     element={
    //       <Private
    //         component={
    //           <AppStateProvider>
    //             <Page />
    //           </AppStateProvider>
    //         }
    //       />
    //     }
    //   />
    // </Routes>
  
}

export default App;
