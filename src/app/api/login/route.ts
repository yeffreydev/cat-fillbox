import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message, error.status);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!data.session) {
      console.error("No session returned from Supabase for user:", email);
      return NextResponse.json(
        { error: "No session returned" },
        { status: 500 }
      );
    }

    console.log("Access granted for user:", data.user.id);
    console.log(
      "Access token (first 10 chars):",
      data.session.access_token.slice(0, 10)
    );
    console.log(
      "Refresh token (first 10 chars):",
      data.session.refresh_token.slice(0, 10)
    );
    console.log("Expires in:", data.session.expires_in, "seconds");

    const response = NextResponse.json({
      ok: true,
      accessToken: data.session.access_token,
    });

    // Store accessToken and refreshToken as secure cookies
    response.cookies.set("accessToken", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 30, // 30 minutes
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("refreshToken", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error in login:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log("Deleting accessToken and refreshToken cookies");
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  } catch (error) {
    console.error("Error in logout:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
