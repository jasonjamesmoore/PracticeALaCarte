import { NavLink } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { Page } from "../utils/types";

type PracticeSessionCardProps = {
  parentPage: Page;
  childrenPages: Page[];
};

export function PracticeSessionCard({
  parentPage,
  childrenPages,
}: PracticeSessionCardProps) {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      {/* Parent Link */}
      <NavLink
        label={
          <span
            style={{ color: "inherit", textDecoration: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${parentPage.slug}`);
            }}
          >
            {parentPage.title}
          </span>
        }
        childrenOffset={28}
        opened={opened}
        rightSection={
          childrenPages.length > 0 && (
            <div
              onClick={(event) => {
                event.stopPropagation();
                setOpened((prev) => !prev);
              }}
              style={{
                cursor: "pointer",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <IconChevronRight size={16} stroke={1.5} />
            </div>
          )
        }
      >
        {childrenPages.length > 0 &&
          childrenPages.map((childPage) => {
            if (!childPage.id) return null;

            return (
              <PracticeSessionCard
                key={childPage.id}
                parentPage={childPage}
                childrenPages={childPage.children || []} // Recursively pass children
              />
            );
          })}
      </NavLink>
    </div>
  );
}
