import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function uploadImage(file: File, folder: string = "users") {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images") 
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(`${folder}/${fileName}`);

    return { success: true, url: urlData.publicUrl };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}




// delete image
function extractPathFromUrl(url: string, bucket: string) {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const parts = url.split(marker);
    if (parts.length > 1) {
      return parts[1]; 
    }
    return url;
  } catch {
    return url;
  }
}

export async function deleteImage(
  urlOrPath: string,
  bucket: string = "images"
) {
  try {
    const path = urlOrPath.includes("supabase.co/storage/v1/object/public/")
      ? extractPathFromUrl(urlOrPath, bucket)
      : urlOrPath;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return { success: true, message: "Image deleted successfully" };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}