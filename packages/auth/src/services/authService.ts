import { ContentType, FetchMethod } from "@repo/shared";
import { fetchData } from "@repo/shared";
import { SignInInput, SignUpInput } from "#schema/authSchema";

export const authService = {
  signUp: async (data: SignUpInput) => {
    return await fetchData({
      slug: "auth/signup",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },
  signIn: async (data: SignInInput) => {
    return await fetchData({
      slug: "auth/signin",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },
};
