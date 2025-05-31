import { auth } from "@/auth";

export async function getValidSessionUserId() {
  const session = await auth();
  if (
    !session?.user?.id ||
    !session?.expires ||
    new Date(session.expires) < new Date()
  ) {
    return null;
  }
  return session.user.id;
}
