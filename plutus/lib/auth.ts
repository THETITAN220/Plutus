import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "@/utils/password";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        await connectToDatabase();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // Create a new user with oauthProvider as 'google'
          user = await User.create({
            name: profile.name,
            email: profile.email,
            oauthProvider: "google",
          });
        } else if (user.oauthProvider !== "google") {
          // If the user exists but was created using credentials, update oauthProvider
          user.oauthProvider = "google";
          await user.save();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials.");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found.");
        }

        // If user signed up with Google, ask them to set a password
        if (user.oauthProvider === "google" && !user.hashedPassword) {
          throw new Error("You signed up with Google. Set a password first.");
        }

        // Validate password if the user is signing in with credentials
        if (user.oauthProvider === "credentials") {
          const isPasswordValid = comparePassword(
            credentials.password as string,
            user.hashedPassword,
            user.salt
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
        }

        // Ensure the user has the correct oauthProvider set if they are trying to log in with credentials
        if (user.oauthProvider !== "credentials") {
          user.oauthProvider = "credentials";
          await user.save();
        }

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("User", user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt", // Use JWT-based sessions (optional)
  },
});
