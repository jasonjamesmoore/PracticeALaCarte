import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthSession } from "../Auth/AuthSessionContext";
import { Page, ChildPage, ParentPage } from "../utils/types";
import { PracticeSessionCard } from "./PracticeSessionCard";

const PageNav = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [childPages, setChildPages] = useState<ChildPage[]>([]);
  const [parentPages, setParentPages] = useState<ParentPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedParentPages, setGroupedParentPages] = useState<Record<string, ParentPage[]>>({});

  const { session } = useAuthSession();

  const fetchPages = async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    setPages([]);
    setParentPages([]);
    setChildPages([]);

    const { data: fetchedPages, error } = await supabase
      .from("pages")
      .select("id::text,title,slug")
      .eq("created_by", session.user.id);

    if (error) {
      console.error("Error fetching pages:", error);
      return;
    }

    // console.log("Fetched pages from Supabase:", fetchedPages);

    if (fetchedPages.length === 0) {
      console.error("No pages found for the user.");
      setLoading(false);
      return;
    }

    setPages(fetchedPages as Page[]);

    const fetchedPagesIds: string[] = fetchedPages.map((page) => page.id);
    // console.log("fetchedPagesIds:", fetchedPagesIds);
    //fetching parent and child pages
    const [parentData, childData] = await Promise.all([
      supabase
        .from("page_relations")
        .select(
          "parent_page_id::text, child_page_id::text, child_page:pages!child_page_id(id::text, title, slug)"
        )
        .in("parent_page_id", fetchedPagesIds),
      supabase
        .from("page_relations")
        .select(
          "parent_page_id::text, child_page_id::text, parent_page:pages!parent_page_id(id::text, title, slug)"
        )
        .in("child_page_id", fetchedPagesIds),
    ]);

    // console.log("Parent Data:", parentData.data);
    if (parentData.error) {
      console.error("Error fetching parent pages:", parentData.error);
    } else {
      const groupedParentPages = parentData.data.reduce<
        Record<
          string, ParentPage[]>>(
            (accumulator, relation) => {
              const { parent_page_id, child_page_id, child_page } = relation;
              if (!accumulator[parent_page_id]) {
                accumulator[parent_page_id] = [];
              }
              accumulator[parent_page_id].push({
                parent_page_id,
                child_page_id,
                child_page: child_page?.length
                  ? {
                      id: child_page[0].id,
                      title: child_page[0].title,
                      slug: child_page[0].slug,
                    }
                  : { id: "", title: "", slug: "" },
              });
              return accumulator;
            },
            {}
          );
          setGroupedParentPages(groupedParentPages);
      // const groupedParentPages = parentData.data.reduce<
      //   Record<
      //     string,
      //     {
      //       child_page_id: string;
      //       child_page: { id: string; title: string; slug: string };
      //     }[]
      //   >
      // >((accumulator, relation) => {
      //   const { parent_page_id, child_page_id, child_page } = relation;

      //   if (!accumulator[parent_page_id]) {
      //     accumulator[parent_page_id] = [];
      //   }

      //   accumulator[parent_page_id].push({
      //     child_page_id,
      //     child_page: child_page?.length
      //       ? {
      //           id: child_page[0].id,
      //           title: child_page[0].title,
      //           slug: child_page[0].slug,
      //         }
      //       : { id: "", title: "", slug: "" },
      //   });
      //   console.log("Accumulator so far:", accumulator);
      //   return accumulator;
      // }, {});

      // console.log("grouped parent pages:", groupedParentPages);
      const parentPagesArray = Object.keys(groupedParentPages).flatMap(
        (parent_page_id) => {
          const children = groupedParentPages[parent_page_id] ?? [];
          return children.map((child) => ({
            parent_page_id,
            child_page_id: child.child_page_id.toString(),
            child_page: child.child_page,
          }));
        }
      );

      setParentPages(parentPagesArray);
    }

    if (childData.error) {
      console.error("Error fetching child pages:", childData.error);
    } else {
      setChildPages(
        childData.data.map((relation) => ({
          id: relation.child_page_id.toString(),
          child_page_id: relation.child_page_id.toString(),
          parent_page_id: relation.parent_page_id.toString(),
          title: relation.parent_page?.length
            ? relation.parent_page[0].title
            : "",
          slug: relation.parent_page?.length
            ? relation.parent_page[0].slug
            : "",
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session && loading) {
      fetchPages();
    }
  }, [session, loading]);

  const practiceRoutines = Object.entries(groupedParentPages).map(([parentId, children]) => {
    const parentPageData = pages.find((page) => page.id === parentId) ?? null;

    return (
      console.log("Rendering PracticeSessionCard with Childs:", children),
      console.log("Rendering PracticeSessionCard with parentId", parentId),
      console.log("Rendering PracticeSessionCard with parentPageData", parentPageData),
      console.log("Rendering PracticeSessionCard with pages", pages),
      console.log("Rendering PracticeSessionCard with childPages", childPages),
      <PracticeSessionCard
        key={parentId}
        page={parentPageData ?? { id: "", slug: "", title: "", nodes: [], cover: "" }}
        parentPages={children} // Now contains all children of this parent
        childPages={childPages}
        pages={pages}
      />
    );
  });
  // const practiceRoutines = parentPages.map((parent) => {
  //   // const relatedChildPages = childPages.filter((childPage) => {
  //   //   // console.log(
  //   //   //   "page.id type:",
  //   //   //   typeof pages[0]?.id,
  //   //   //   "parent.parent_page_id type:",
  //   //   //   typeof parentPages[0]?.parent_page_id
  //   //   // );

  //   //   const parentId = String(parent.parent_page_id);
  //   //   const childPageId = String(childPage.parent_page_id);
  //   //   return childPageId === parentId;
  //   // });

  //   const pageData =
  //     pages.find((page) => page.id === parent.parent_page_id) ?? null;

  //   return (
  //     console.log("rendering practicesession card", parent),
  //     (
  //       <PracticeSessionCard
  //         key={`${parent.parent_page_id}-${parent.child_page_id}`}
  //         page={
  //           pageData ?? { id: "", slug: "", title: "", nodes: [], cover: "" }
  //         }
  //         parentPages={parentPages}
  //         childPages={childPages}
  //         pages={pages}
  //       />
  //     )
  //   );
  // });

  return <>{pages.length === 0 ? <p>Loading...</p> : practiceRoutines}</>;
};

export default PageNav;
