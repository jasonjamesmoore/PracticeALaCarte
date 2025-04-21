import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthSession } from "../Auth/AuthSessionContext";
import { Page, ParentChildRelation } from "../utils/types";
import { PracticeSessionCard } from "./PracticeSessionCard";

const PageNav = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [groupedParentPages, setGroupedParentPages] = useState<
    Record<string, ParentChildRelation[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [rootLevelPages, setRootLevelPages] = useState<Page[]>([]);

  const { session } = useAuthSession();

  const fetchPages = async () => {
    if (!session) return;

    setLoading(true);

    //Fetching user's pages
    const { data: fetchedPages, error: pageError } = await supabase
      .from("pages")
      .select("id::text, title, slug")
      .eq("created_by", session.user.id);

    if (pageError) {
      console.error("Error fetching pages:", pageError);
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

    // Fetching parent-child page relations
    const { data: relations, error: relationsError } = await supabase
      .from("page_relations")
      .select(
        "parent_page_id::text, child_page_id::text, is_root, child_page:pages!child_page_id(id::text, title, slug)"
      )
      .or(
        `parent_page_id.in.(${fetchedPagesIds}), child_page_id.in.(${fetchedPagesIds})`
      )
      .returns<
        {
          parent_page_id: string;
          child_page_id: string;
          is_root: boolean;
          child_page: {
            id: string;
            title: string;
            slug: string;
          } | null;
        }[]
      >();

    if (relationsError) {
      console.error("Error fetching relations:", relationsError);
    }

    console.log("Raw relations Data:", JSON.stringify(relations, null, 2));

    // Process relations data into groups
    const groupedParents: Record<string, ParentChildRelation[]> = {};

    relations?.forEach(({ parent_page_id, child_page_id, child_page }) => {
      if (parent_page_id === null) {
        return;
      }
      if (!groupedParents[parent_page_id]) {
        groupedParents[parent_page_id] = [];
      }

      groupedParents[parent_page_id].push({
        parentPageId: parent_page_id,
        childPageId: child_page_id,
        childPage: child_page ? child_page : { id: "", title: "", slug: "" },
      });
    });
    console.log(
      "Processed groupedParents:",
      JSON.stringify(groupedParents, null, 2)
    );

    const rootPages = relations
      .filter((relation) => relation.is_root) // Only include explicitly root pages
      .map((relation) =>
        fetchedPages.find((page) => page.id === relation.child_page_id)
      )
      .filter((page): page is Page => !!page); // Remove undefined values

    setGroupedParentPages(groupedParents);
    setRootLevelPages(rootPages);
    setLoading(false);
  };

  useEffect(() => {
    if (session && loading) {
      fetchPages();
    }
  }, [session, loading]);

  const practiceRoutines = [
    ...Object.entries(groupedParentPages).map(([parentId, relatedChildren]) => {
      const parentPageData = pages.find((page) => page.id === parentId) ?? {
        id: "",
        slug: "",
        title: "",
        nodes: [],
        cover: "",
      };

      return (
        <PracticeSessionCard
          key={parentId}
          parentPage={parentPageData}
          childrenPages={relatedChildren}
        />
      );
    }),

    ...rootLevelPages.map((page) => (
      <PracticeSessionCard key={page.id} parentPage={page} childrenPages={[]} />
    )),
  ];

  return <>{pages.length === 0 ? <p>Loading...</p> : practiceRoutines}</>;
};

export default PageNav;
