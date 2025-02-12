import { supabase } from "../supabaseClient";

export const uploadImage = async (file?: File) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = fileName;

    await supabase.storage.from("images").upload(filePath, file);

    return { filePath, fileName };
  } catch (e) {
    alert(e);
  }
};
