import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Server-side Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

// Server-side function to get Supabase client with session
export const getSupabaseWithSession = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    try {
      console.log(
        "Attempting to set Supabase session with accessToken:",
        accessToken.slice(0, 10) + "..."
      );
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        console.error(
          "Error setting Supabase session:",
          error.message,
          error.status
        );
        // Attempt to refresh session if token is expired
        if (error.message.includes("expired")) {
          console.log(
            "Access token expired, attempting to refresh with refreshToken"
          );
          const { data, error: refreshError } =
            await supabase.auth.refreshSession({
              refresh_token: refreshToken,
            });
          if (refreshError || !data.session) {
            console.error("Failed to refresh session:", refreshError?.message);
          } else {
            console.log(
              "Session refreshed successfully, new accessToken:",
              data.session.access_token.slice(0, 10) + "..."
            );
            // Update cookies with new tokens
            cookieStore.set("accessToken", data.session.access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 30,
              path: "/",
              sameSite: "strict",
            });
            cookieStore.set("refreshToken", data.session.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
              sameSite: "strict",
            });
          }
        }
      } else {
        console.log("Supabase session set successfully");
      }
    } catch (err) {
      console.error("Unexpected error setting Supabase session:", err);
    }
  } else {
    console.log(
      "No accessToken or refreshToken cookies found, proceeding without session"
    );
  }

  return supabase;
};
