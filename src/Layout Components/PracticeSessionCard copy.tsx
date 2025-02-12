import { NavLink } from "@mantine/core";
// import classes from "./PracticeSessionCard.module.css";
import { Page, ChildPage, ParentPage } from "../utils/types";

type PracticeSessionCardProps = {
  page: Page;
  parentPages: ParentPage[];
  childPages: ChildPage[];
  pages: Page[];
};

export function PracticeSessionCard({
  page,
  childPages,
  parentPages,
  pages,
}: PracticeSessionCardProps) {
  const uniqueParentPages = [
    ...new Map(parentPages.map((p) => [p.parent_page_id, p])).values(),
  ];
  console.log("Unique Parent Pages:", uniqueParentPages);
  console.log("All Parent Pages:", parentPages);
  console.log("Child Pages:", childPages);

  const renderPageLinks =
    uniqueParentPages.length > 0 ? (
      <div>
        {uniqueParentPages.map((parentRelation) => {
          const parentPage = pages.find(
            (p) => p.id === parentRelation.parent_page_id
          );
          if (!parentPage) return null;

          const relatedChildPages = childPages.filter(
            (childPage) => childPage.parent_page_id === parentPage.id
          );
          // const relatedChildPages = parentPages
          //   .filter((relation) => relation.parent_page_id === parentPage.id)
          //   .map((relation) =>
          //     pages.find((p) => p.id === relation.child_page_id)
          //   )
          //   .filter(Boolean); // Remove null values
          return (
            <NavLink
              key={`parent-${parentPage.id}`}
              href={`/${parentPage.slug}`}
              label={parentPage.title}
              childrenOffset={28}
            >
              {relatedChildPages.length > 0 ? (
                relatedChildPages.map((childPage) => {
                  if (!childPage.id) return null;
                  return (
                    <NavLink
                      key={`parent-${parentPage.id}-child-${childPage.child_page_id}`}
                      href={`/${childPage.slug}`}
                      label={childPage.title}
                    />
                  );
                })
              ) : (
                <p>No child pages available.</p>
              )}
            </NavLink>
          );
        })}
      </div>
    ) : (
      <p>No parent pages available.</p>
    );
  return <>{renderPageLinks}</>;
}
