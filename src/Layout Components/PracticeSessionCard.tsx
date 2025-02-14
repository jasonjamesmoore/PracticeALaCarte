// here is some ai help

// import { NavLink } from "@mantine/core";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
// import { Page, ParentChildRelation } from "../utils/types";

// type PracticeSessionCardProps = {
//   parentPage: Page;
//   childrenPages: ParentChildRelation[];
// };

// export function PracticeSessionCard({
//   parentPage,
//   childrenPages,
// }: PracticeSessionCardProps) {
//   const [opened, setOpened] = useState(false);

//   const uniqueChildren = [
//     ...new Map(childrenPages.map((p) => [p.childPageId, p])).values(),
//   ];

//   return (
//     <div>
//       {/* Parent Link (Navigates only) */}
//       <NavLink
//         label={
//           <Link to={`/${parentPage.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
//             {parentPage.title}
//           </Link>
//         }
//         childrenOffset={28}
//         opened={opened}
//         rightSection={
//           uniqueChildren.length > 0 ? (
//             <div
//               onClick={(event) => {
//                 event.stopPropagation(); // Prevents navigation when clicking the chevron
//                 setOpened((prev) => !prev);
//               }}
//               style={{ cursor: "pointer", padding: "4px" }}
//             >
//               {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
//             </div>
//           ) : null
//         }
//       >
//         {uniqueChildren.map((childRelation) => {
//           const childPage = childRelation.childPage;
//           if (!childPage.id) return null;

//           return (
//             <NavLink
//               component={Link}
//               key={`child-${childPage.id}`}
//               to={`/${childPage.slug}`}
//               label={childPage.title}
//             />
//           );
//         })}
//       </NavLink>
//     </div>
//   );
// }

// below is my code

import { NavLink } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// import classes from "./PracticeSessionCard.module.css";
import { Page, ParentChildRelation } from "../utils/types";

type PracticeSessionCardProps = {
  parentPage: Page;
  childrenPages: ParentChildRelation[];
};

export function PracticeSessionCard({
  parentPage,
  childrenPages,
}: PracticeSessionCardProps) {
  console.log("childrenPages Prop in PracticeSessionCard:", childrenPages);
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const uniqueChildren = [
    ...new Map(childrenPages.map((p) => [p.childPageId, p])).values(),
  ];

  const handleClick = () => {
    setOpened((prev) => !prev); // Toggle children visibility
    // navigate(`/${parentPage.slug}`); // Navigate to parent page
  };

  console.log("Unique Child Pages in Card:", uniqueChildren);
  console.log(
    "Unique Child Pages in Card:",
    JSON.stringify(uniqueChildren, null, 2)
  );

  const renderPageLinks =
    uniqueChildren.length > 0 ? (
      <>
        {uniqueChildren.map((childRelation) => {
          const childPage = childRelation.childPage;
          if (!childPage.id) return null;

          return (
            <NavLink
              component={Link}
              key={`child-${childPage.id}`}
              to={`/${childPage.slug}`}
              label={childPage.title}
            />
          );
        })}
      </>
    ) : (
      <p>No child pages available.</p>
    );

  return (
    <NavLink
      component={Link}
      to={`/${parentPage.slug}`}
      label={parentPage.title}
      childrenOffset={28}
      onClick={handleClick} // Handles both toggle & navigation
      opened={opened}
    >
      {renderPageLinks}
    </NavLink>
  );
}
