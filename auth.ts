import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./models/user-model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { sendLoginRegistrationEmail } from "./lib/email";
import { generateEncryptedToken } from "./lib/encryption";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "public_profile,email",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        try {
          const isVerifyEmailFlow =
            credentials?.verifyEmail === "true" ||
            credentials?.verifyEmail === true;

          if (!isVerifyEmailFlow) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email and password are required");
            }
          }

          if (!credentials?.email) {
            throw new Error("Email is required");
          }

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified && !isVerifyEmailFlow) {
            throw new Error(
              "Please verify your email before logging in. Check your inbox for verification link.",
            );
          }

          if (!user.isActive) {
            throw new Error("Account is deactivated");
          }

          if (!isVerifyEmailFlow) {
            if (!user.password) {
              throw new Error("Please login using Google/Facebook/GitHub");
            }

            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isMatch) {
              throw new Error("Invalid password");
            }
          }

          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            isVerified: user.isVerified,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            phone: user.phone,
            image: user.image,
            billingAddress: user.billingAddress || null,    // ✅ null check
            shippingAddress: user.shippingAddress || null,  // ✅ null check
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            console.log("Existing user logged in:", existingUser.email);
            existingUser.lastLogin = new Date();
            await existingUser.save();

            if (!existingUser.provider && account?.provider) {
              existingUser.provider = account.provider;
              existingUser.providerId = account.providerAccountId;
              await existingUser.save();
            }

            return true;
          } else {
            console.log("New user signing up:", user.email);
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
              isVerified: true,
              isActive: true,
              lastLogin: new Date(),
              billingAddress: null,   // ✅ initialize
              shippingAddress: null,  // ✅ initialize
            });
            const encryptedToken = generateEncryptedToken(user.email, 'social-login');
            const verificationUrl = `/verify-email?token=${encodeURIComponent(encryptedToken)}`;
            await sendLoginRegistrationEmail(
              user.email,
              user.name,
              `${process.env.NEXTAUTH_URL}${verificationUrl}`,
            );
            return true;
          }
        } catch (error) {
          console.error("OAuth signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id?.toString();
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.provider = account?.provider;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.displayName = user.displayName;
        token.phone = user.phone;
        token.image = user.image;
        token.billingAddress = user.billingAddress || null;   // ✅ set from user
        token.shippingAddress = user.shippingAddress || null; // ✅ set from user

        // Get latest DB user data
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.dbExists = true;
          token.userId = dbUser._id.toString();
          token.role = dbUser.role;
          token.isVerified = dbUser.isVerified;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.displayName = dbUser.displayName;
          token.phone = dbUser.phone;
          token.image = dbUser.image;
          token.billingAddress = dbUser.billingAddress || null;   // ✅ from DB
          token.shippingAddress = dbUser.shippingAddress || null; // ✅ from DB
        }
      }

      // 🔥 Session update handle - এই অংশ ঠিকানা আপডেট করবে
      if (trigger === "update" && session) {
        // Update token with new user data from session
        if (session.user) {
          token.name = session.user.name;
          token.firstName = session.user.firstName;
          token.lastName = session.user.lastName;
          token.displayName = session.user.displayName;
          token.phone = session.user.phone;
          token.image = session.user.image;
        }
        
        // ✅ Update addresses from session
        if (session.billingAddress !== undefined) {
          token.billingAddress = session.billingAddress;
        }
        if (session.shippingAddress !== undefined) {
          token.shippingAddress = session.shippingAddress;
        }

        // Update database with new addresses
        if (token.email) {
          try {
            const updateData: any = {
              updatedAt: new Date(),
            };
            
            if (session.user?.firstName) updateData.firstName = session.user.firstName;
            if (session.user?.lastName) updateData.lastName = session.user.lastName;
            if (session.user?.displayName) updateData.displayName = session.user.displayName;
            if (session.user?.phone) updateData.phone = session.user.phone;
            if (session.user?.name) updateData.name = session.user.name;
            if (session.user?.image) updateData.image = session.user.image;
            if (session.billingAddress !== undefined) updateData.billingAddress = session.billingAddress;
            if (session.shippingAddress !== undefined) updateData.shippingAddress = session.shippingAddress;
            
            if (Object.keys(updateData).length > 1) { // more than just updatedAt
              await User.findOneAndUpdate(
                { email: token.email },
                { $set: updateData }
              );
            }
          } catch (error) {
            console.error("Error updating user in database from session:", error);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isExisting = token.dbExists as boolean;
        session.user.provider = token.provider as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.displayName = token.displayName as string;
        session.user.phone = token.phone as string;
        session.user.image = token.image as string;
        
        // ✅ Add addresses to session
        session.user.billingAddress = token.billingAddress as object || null;
        session.user.shippingAddress = token.shippingAddress as object || null;

        // If displayName not set, use firstName or email
        if (!session.user.displayName && session.user.firstName) {
          session.user.displayName = session.user.firstName;
        } else if (!session.user.displayName && session.user.email) {
          session.user.displayName = session.user.email.split('@')[0];
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
});