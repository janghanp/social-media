import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProviders from "next-auth/providers/github";

import { prisma } from "../../../lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProviders({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.SECRET,
  },
});
