import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import CreateBlogForm from "./CreateBlogForm";

export default async function CreatePage() {
  unstable_noStore();
  const token = await getToken();
  if (!token) {
    redirect("/auth/login");
  }
  return <CreateBlogForm />;
}
