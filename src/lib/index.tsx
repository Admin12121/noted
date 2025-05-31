import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export const getUserbyEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({where:{email}});
        return user
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserbyId = async (id: string) => {
    try {
        const user = await db.user.findUnique({where :{id}});
        return user
    } catch (error) {
        console.error(error);
        return null;
    }
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";


export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!decoded?.id) return null;
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch {
    return null;
  }
}
