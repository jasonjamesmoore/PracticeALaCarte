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

	const { data: pageData } = await supabase
		.from("pages")
		.insert(page)
		.select("id")
		.single();

	page.id = pageData?.id;

	if (parentPageId) {
		const { count, error } = await supabase
			.from("page_relations")
			.select("child_page_id", {count: "exact"})
			.eq("parent_page_id", parentPageId)

			if (error) { 
				console.error("Error fetching child page count:", error);
			} else {
				const parentPageChildCount = count || 0;
				const relation = {
					parent_page_id: parentPageId,
					child_page_id: page.id,
					position: parentPageChildCount + 1,
				};
				await supabase.from("page_relations").insert(relation);
			}
			
		
	}

	return page;
};

