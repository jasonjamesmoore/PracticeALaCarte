import { nanoid } from "nanoid";
import { supabase } from "../supabaseClient";

export const createPage = async (parentPageId: string | null = null) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    throw new Error("You must be logged in to create a page.");
  }
  const slug = nanoid();

  const page = {
    id: undefined,
    title: "Untitled",
    slug,
    nodes: [],
    created_by: user.id,
  };

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .insert(page)
    .select("id")
    .single();

  if (pageError) {
    throw new Error("Error creating page: " + pageError.message);
  }

  page.id = pageData?.id;

  if (!parentPageId) {
    const rootRelation = {
      parent_page_id: page.id,
      child_page_id: null,
      position: 1,
      is_root: true,
    };
    await supabase.from("page_relations").insert(rootRelation);
  } else {
    const { count, error: relationError } = await supabase
      .from("page_relations")
      .select("child_page_id", { count: "exact" })
      .eq("parent_page_id", parentPageId);

    if (relationError) {
      console.error("Error fetching child page count:", relationError);
    }

    const position = (count || 0) + 1; // Ensures correct positioning
    const childRelation = {
      parent_page_id: parentPageId, // NULL for root-level pages
      child_page_id: page.id,
      position,
      is_root: false,
    };
    await supabase.from("page_relations").insert(childRelation);
  }

  return page;
};
