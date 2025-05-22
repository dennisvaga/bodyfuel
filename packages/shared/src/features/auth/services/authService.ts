import { ContentType, FetchMethod } from "#types/enums";
import { fetchData } from "#services/apiClient";
import { SignInInput, SignUpInput } from "#auth/schema/authSchema";

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
