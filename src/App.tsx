import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
import { theme } from "./theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Router />
      </MantineProvider>
    </DndProvider>
  );
}

export default App;
