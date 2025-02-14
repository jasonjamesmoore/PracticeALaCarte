// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
// import { Welcome } from '../components/Welcome/Welcome';
import React from "react";
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
  Paper,
  ScrollArea,
  Skeleton,
} from "@mantine/core";
// import { FaSun, FaMoon } from 'react-icons/fa';
// import ButtonComponent from '../components/Buttons';
// import { NavLink } from "@mantine/core";
import PageNav from "./PageNav";
// import { CollectionNavbar } from "./CollectionNavbar";
import { IconPlus } from "@tabler/icons-react";
import { NavbarLinksGroup } from "./Navigation/NavbarLinksGroup";
// import { PracticeSessionCard } from "./PracticeSessionCard";

export function MainLayout() {
  const [opened, { toggle }] = useDisclosure();
  // const [currentComponent, setCurrentComponent] =
  //   React.useState<string>("component1");

  return (
    <AppShell
      header={{ height: 60 }}
      // footer={{height: 60}}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
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
        {/* <CollectionNavbar /> */}
        {/* <PracticeSessionCard /> */}
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Group justify="space-between">
          <Text size="md" fw={500} c="dimmed">
            Pages
          </Text>
          <Tooltip label="Create Practice Session" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
          <PageNav />
          {/* <NavbarLinksGroup /> */}
        </AppShell.Section>
        <AppShell.Section>🎷🍖HamHorn Productions🍖🎷</AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
