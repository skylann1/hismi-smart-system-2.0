import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client server-side
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "uploads";

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase
        const { error } = await supabase.storage
            .from("images")
            .upload(`${folder}/${fileName}`, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("images")
            .getPublicUrl(`${folder}/${fileName}`);

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
