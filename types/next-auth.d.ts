import type { DefaultSession, DefaultUser } from "next-auth";
// import type { AdapterUser } from "next-auth/adapters";

interface UserSchema extends DefaultUser {
  id: string;
  onboarded: boolean;
  projectId: string | null;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserSchema & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends UserSchema {}
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends UserSchema {}
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends UserSchema {}
}
