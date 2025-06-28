import { fetchData, ContentType, FetchMethod } from "@repo/shared";
import type { ApiResult } from "@repo/shared";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  sendMessage: async (data: ContactFormData): Promise<ApiResult<any>> => {
    return await fetchData({
      slug: "contact",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },
};
