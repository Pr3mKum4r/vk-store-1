"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas/authSchema";
import { AuthError } from "next-auth";
import { z } from "zod";
//Hangle user's login with email and password
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password } = validatedFields.data;
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: "Logged In!" };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials " };
        default:
          return { error: "Somthing went error" };
      }
    }
    throw e;
  }
};
