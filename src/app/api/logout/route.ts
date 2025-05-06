import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Sign out the user using Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Delete the auth cookie
    cookies().delete("supabase-auth-token");

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
