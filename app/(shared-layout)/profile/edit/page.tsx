import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { ProfileEditForm } from "@/components/web/ProfileEditForm";

export default async function EditProfilePage() {
  unstable_noStore();
  const token = await getToken();

  if (!token) {
    redirect("/auth/login");
  }

  const profile = await fetchQuery(api.profile.getCurrentUserProfile, {}, {
    token,
  });

  if (!profile) {
    redirect("/auth/login");
  }

  return <ProfileEditForm initialName={profile.name} />;
}
