import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

// Define schema for account validation
const accountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_at: z.number().optional(),
  token_type: z.string().optional(),
  scope: z.string().optional(),
  id_token: z.string().optional(),
  session_state: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state } = accountSchema.parse(body);

    // Check if account already exists
    const existingAccount = await prisma.account.findFirst({
      where: {
        providerAccountId: providerAccountId,
        provider: provider,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { user: null, message: "Account already exists" },
        { status: 409 }
      );
    }

    // Create new account
    const account = await prisma.account.create({
      data: {
        userId,
        type,
        provider,
        providerAccountId,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
        session_state,
      },
    });

    return NextResponse.json(
      { account, message: "Account created successfully" },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 }
    );
  }
}

// GET method to retrieve account details
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(accounts, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 }
    );
  }
}