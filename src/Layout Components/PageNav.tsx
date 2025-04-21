import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuthSession } from "../Auth/AuthSessionContext";
import { Page, ParentChildRelation } from "../utils/types";
import { PracticeSessionCard } from "./PracticeSessionCard";

const buildPageTree = (pages: Page[], relations: ParentChildRelation[]) => {
  const pageMap = new Map<string, { page: Page; children: Page[] }>();

  pages.forEach((page) => {
    pageMap.set(page.id, { page, children: [] });
  });

  relations.forEach((relation) => {
    const parent = pageMap.get(relation.parent_page_id);
    const child = pageMap.get(relation.child_page_id);

    if (parent && child) {
      parent.children.push(child.page);
    }
  });

  const rootPages = pages.filter(
    (page) => !relations.some((relation) => relation.child_page_id === page.id)
  );

  const buildNestedTree = (page: Page): Page & { children: Page[] } => ({
    ...page,
    children: (pageMap.get(page.id)?.children || []).map(buildNestedTree),
  });

  return rootPages.map(buildNestedTree);
};

const PageNav = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [rootLevelPages, setRootLevelPages] = useState<
    (Page & { children: Page[] })[]
  >([]);

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
      .returns<ParentChildRelation[]>();

    if (relationsError) {
      console.error("Error fetching relations:", relationsError);
    }

    const safeRelations = relations ?? [];
    const pageTree = buildPageTree(fetchedPages, safeRelations);

    setRootLevelPages(pageTree);
    setLoading(false);
  };

  useEffect(() => {
    if (session && loading) {
      fetchPages();
    }
  }, [session, loading]);

  const renderPageTree = (page: Page & { children: Page[] }) => (
    <PracticeSessionCard
      key={page.id}
      parentPage={page}
      childrenPages={page.children}
    />
  );

  return (
    <>{loading ? <p>Loading...</p> : rootLevelPages.map(renderPageTree)}</>
  );
};

export default PageNav;
