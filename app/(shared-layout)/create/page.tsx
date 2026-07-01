import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import CreateBlogForm from "./CreateBlogForm";

export default async function CreatePage() {
  const token = await getToken();
  if (!token) {
    redirect("/auth/login");
  }
  return <CreateBlogForm />;
}
