import { getAdminSession } from "@/lib/admin-session";
import SettingsForm from "./settings-form";

export default async function AdminSettingsPage() {
  const user = await getAdminSession();
  if (!user) return null;

  return <SettingsForm store={user.store} />;
}