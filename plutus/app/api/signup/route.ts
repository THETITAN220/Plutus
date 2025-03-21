import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { generateSalt, hashPassword } from "@/utils/password";

export async function POST(req: Request) {
  try {
    const { email, password, name, oauthProvider } = await req.json();

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    let newUser;

    if (oauthProvider === "google") {
      // If the user is signing up via Google
      newUser = new User({
        email,
        name,
        oauthProvider: "google",
      });
      await newUser.save();
    } else {
      // If the user is signing up with manual credentials
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
      newUser = new User({
        email,
        name,
        salt,
        hashedPassword,
        oauthProvider: "credentials",
      });
      await newUser.save();
    }

    // Create a corresponding Profile for the new user

    return NextResponse.json(
      { message: "User and Profile created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
