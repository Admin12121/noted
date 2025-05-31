import { useSession, signOut } from "next-auth/react";

export const useAuthUser = () => {
    const session = useSession();

    const Update = async () => {
        await session.update();
    };

    return {
        expire: session.data?.expires,
        user: session.data?.user,
        status: session.status,
        signOut: signOut,
        update: Update,
    };
};
