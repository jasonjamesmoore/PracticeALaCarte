import { Outlet } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  Text,
  Tooltip,
  ActionIcon,
  Flex,
  AppShell,
  Burger,
  Button,
  ScrollArea,
} from "@mantine/core";
import PageNav from "./PageNav";
import { MenuDrawer } from "./Menu Drawer/MenuDrawer";
import { IconPlus } from "@tabler/icons-react";
import { createPage } from "../utils/createPage";
import { useNavigate } from "react-router-dom";

export function MainLayout() {
  const [opened, { toggle }] = useDisclosure();

  const navigate = useNavigate();
  const handleCreateRootPage = async () => {
    const newPage = await createPage(null);
    if (newPage) {
      navigate(`/${newPage.slug}`);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      // footer={{height: 60}}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          style={{ padding: "10px 20px" }}
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>Peep this burger</div>
          <Button size="sm" variant="link">
            Yup
          </Button>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md" style={{ gap: "10px" }}>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <MenuDrawer />
          <Group justify="space-between">
            <Text size="md" fw={500} c="dimmed">
              Pages
            </Text>
            <Tooltip label="Create Practice Session" withArrow position="right">
              <ActionIcon
                variant="default"
                size={18}
                onClick={handleCreateRootPage}
              >
                <IconPlus size={12} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <PageNav />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
