import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
            isVerified: boolean;
            isAcceptingMessage: boolean;
            name: string | null | undefined;      // allow undefined here
            email: string | null | undefined;     // allow undefined here
        };
    }
}
declare module "next-auth" {
    interface User {
        id: string;
        name: string | null | undefined;
        email: string | null | undefined;
        isVerified: boolean;
        isAcceptingMessage: boolean;

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            name: string | null | undefined;
            email: string | null | undefined;
            isVerified: boolean;
            isAcceptingMessage: boolean;
        };
    }
}
