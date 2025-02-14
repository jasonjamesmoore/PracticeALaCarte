import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthSession } from "../Auth/AuthSessionContext";
import {
  Page,
  ChildPage,
  ParentPage,
  ParentChildRelation,
} from "../utils/types";
import { PracticeSessionCard } from "./PracticeSessionCard";

const PageNav = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [childPages, setChildPages] = useState<ChildPage[]>([]);
  const [parentPages, setParentPages] = useState<ParentPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedParentPages, setGroupedParentPages] = useState<
    Record<string, ParentChildRelation[]>
  >({});

  const { session } = useAuthSession();

  const fetchPages = async () => {
    if (!session) return;

    setLoading(true);
    setPages([]);
    setParentPages([]);
    setChildPages([]);

    const { data: fetchedPages, error } = await supabase
      .from("pages")
      .select("id::text, title, slug")
      .eq("created_by", session.user.id);

    if (error) {
      console.error("Error fetching pages:", error);
      setLoading(false);
      return;
    }

    if (!fetchedPages || fetchedPages.length === 0) {
      console.warn("No pages found for the user.");
      setLoading(false);
      return;
    }

    setPages(fetchedPages as Page[]);

    const fetchedPagesIds: string[] = fetchedPages.map((page) => page.id);

    // Fetching parent and child page relations
    const { data: parentData, error: parentError } = await supabase
      .from("page_relations")
      .select(
        "parent_page_id::text, child_page_id::text, child_page:pages!child_page_id(id::text, title, slug)"
      )
      .in("parent_page_id", fetchedPagesIds);

    if (parentError) {
      console.error("Error fetching parent pages:", parentError);
    }

    const { data: childData, error: childError } = await supabase
      .from("page_relations")
      .select(
        "parent_page_id::text, child_page_id::text, parent_page:pages!parent_page_id(id::text, title, slug), child_page:pages!child_page_id(id::text, title, slug)"
      )
      .in("child_page_id", fetchedPagesIds);

    if (childError) {
      console.error("Error fetching child pages:", childError);
    }
    console.log("Raw childData:", JSON.stringify(childData, null, 2));

    console.log("Fetched Parent Data:", parentData);
    console.log("Fetched Child Data:", childData);

    // Process Parent Pages
    if (parentData) {
      const groupedParentPages = parentData.reduce<
        Record<string, ParentChildRelation[]>
      >((accumulator, relation) => {
        const { parent_page_id, child_page_id, child_page } = relation;

        if (!accumulator[parent_page_id]) {
          accumulator[parent_page_id] = [];
        }

        const childPageData = childData?.find(
          (child) => child.child_page_id === child_page_id
        );

        // Ensure childPage is always an object with valid properties
        const childPage =
          childPageData && typeof childPageData.child_page === "object"
            ? childPageData.child_page
            : { id: "", title: "", slug: "" };

        accumulator[parent_page_id].push({
          parentPageId: parent_page_id,
          childPageId: child_page_id,
          childPage,
        });

        return accumulator;
      }, {});

      setGroupedParentPages(groupedParentPages);
      console.log("Grouped Parent Pages:", groupedParentPages);
    }

    // Process Child Pages
    if (childData) {
      setChildPages(
        childData.map((relation) => {
          const childPage =
            relation.child_page && typeof relation.child_page === "object"
              ? relation.child_page
              : { id: "", title: "", slug: "" };

          return {
            id: relation.child_page_id.toString(),
            child_page_id: relation.child_page_id.toString(),
            parent_page_id: relation.parent_page_id.toString(),
            title: childPage.title,
            slug: childPage.slug,
          };
        })
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (session && loading) {
      fetchPages();
    }
  }, [session, loading]);

  const practiceRoutines = Object.entries(groupedParentPages).map(
    ([parentId, relatedChildren]) => {
      const parentPageData = pages.find((page) => page.id === parentId) ?? null;

      return (
        <PracticeSessionCard
          key={parentId}
          parentPage={
            parentPageData ?? {
              id: "",
              slug: "",
              title: "",
              nodes: [],
              cover: "",
            }
          }
          childrenPages={relatedChildren}
        />
      );
    }
  );

  return <>{pages.length === 0 ? <p>Loading...</p> : practiceRoutines}</>;
};

export default PageNav;



// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuthSession } from "../Auth/AuthSessionContext";
// import {
//   Page,
//   ChildPage,
//   ParentPage,
//   ParentChildRelation,
// } from "../utils/types";
// import { PracticeSessionCard } from "./PracticeSessionCard";

// const PageNav = () => {
//   const [pages, setPages] = useState<Page[]>([]);
//   const [childPages, setChildPages] = useState<ChildPage[]>([]);
//   const [parentPages, setParentPages] = useState<ParentPage[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [groupedParentPages, setGroupedParentPages] = useState<
//     Record<string, ParentChildRelation[]>
//   >({});

//   const { session } = useAuthSession();

//   const fetchPages = async () => {
//     if (!session) {
//       return;
//     }

//     setLoading(true);
//     setPages([]);
//     setParentPages([]);
//     setChildPages([]);

//     const { data: fetchedPages, error } = await supabase
//       .from("pages")
//       .select("id::text,title,slug")
//       .eq("created_by", session.user.id);

//     if (error) {
//       console.error("Error fetching pages:", error);
//       return;
//     }

//     // console.log("Fetched pages from Supabase:", fetchedPages);

//     if (fetchedPages.length === 0) {
//       console.error("No pages found for the user.");
//       setLoading(false);
//       return;
//     }

//     setPages(fetchedPages as Page[]);

//     const fetchedPagesIds: string[] = fetchedPages.map((page) => page.id);
//     // console.log("fetchedPagesIds:", fetchedPagesIds);
//     //fetching parent and child pages
//     const { data: parentData } = await supabase
//       .from("page_relations")
//       .select(
//         "parent_page_id::text, child_page_id::text, child_page:pages!child_page_id(id::text, title, slug)"
//       )
//       .in("parent_page_id", fetchedPagesIds);

//     const { data: childData, error: childError} = await supabase
//       .from("page_relations")
//       .select(
//         "parent_page_id::text, child_page_id::text, parent_page:pages!parent_page_id(id::text, title, slug), child_page:pages!child_page_id(id::text, title, slug)"
//       )
//       .in("child_page_id", fetchedPagesIds);
//     if (childError) {
//       console.error("Error fetching child pages:", childError);
//       return;
//     };
//     if (parentData.error) {
//       console.error("Error fetching parent pages:", parentData.error);
//     } else {
//       const groupedParentPages = parentData.data.reduce<
//         Record<string, ParentChildRelation[]>
//       >((accumulator, relation) => {
//         const { parent_page_id, child_page_id, child_page } = relation;

//         if (!accumulator[parent_page_id]) {
//           accumulator[parent_page_id] = [];
//         }
//         const childPageData = childData.data!.find(
//           (child) => child.child_page_id === child_page_id
//         );

//         const childPage =
//           childPageData && Array.isArray(childPageData.child_page)
//             ? childPageData.child_page[0] // Access the first item in the array
//             : childPageData?.child_page ?? {
//                 id: "",
//                 child_page_id: "",
//                 parent_page_id: "",
//                 title: "",
//                 slug: "",
//               };

//         accumulator[parent_page_id].push({
//           parentPageId: parent_page_id,
//           childPageId: child_page_id,
//           childPage: childPage
//             ? {
//                 id: childPage.id || "",
//                 title: childPage.title || "",
//                 slug: childPage.slug || "",
//               }
//             : { id: "", title: "", slug: "" },
//         });
//         return accumulator;
//       }, {});
//       setGroupedParentPages(groupedParentPages);

//       console.log("grouped parent pages:", groupedParentPages);
//     }

//     if (childData.error) {
//       console.error("Error fetching child pages:", childData.error);
//     } else {
//       setChildPages(
//         childData.data.map((relation) => {
//           const childPage = Array.isArray(relation.child_page)
//             ? relation.child_page[0] // Access the first item if it's an array
//             : relation.child_page;
//           return {
//             id: relation.child_page_id.toString(),
//             child_page_id: relation.child_page_id.toString(),
//             parent_page_id: relation.parent_page_id.toString(),
//             title: childPage ? childPage.title : "",
//             slug: childPage ? childPage.slug : "",
//           };
//         })
//       );

//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (session && loading) {
//       fetchPages();
//     }
//   }, [session, loading]);

//   const practiceRoutines = Object.entries(groupedParentPages).map(
//     ([parentId, relatedChildren]) => {
//       const parentPageData = pages.find((page) => page.id === parentId) ?? null;

//       return (
//         <PracticeSessionCard
//           key={parentId}
//           parentPage={
//             parentPageData ?? {
//               id: "",
//               slug: "",
//               title: "",
//               nodes: [],
//               cover: "",
//             }
//           }
//           childrenPages={relatedChildren}
//         />
//       );
//     }
//   );

//   return <>{pages.length === 0 ? <p>Loading...</p> : practiceRoutines}</>;
// };

// export default PageNav;
