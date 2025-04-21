import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import PractivityCard from "./PractivityCard";

export function MenuDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="The Menu">
        <PractivityCard type="text" content="drag dis" onDragStart={close} />
      </Drawer>

      <Button variant="default" onClick={open}>
        Open Drawer
      </Button>
    </>
  );
}
