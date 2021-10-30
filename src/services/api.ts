import axios, { AxiosError } from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function isAxiosError<T>(
  candidate: unknown
): candidate is AxiosError<T> {
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    "isAxiosError" in candidate &&
    (candidate as AxiosError).isAxiosError === true
  );
}

interface CreateShortUrlRequestBody {
  id?: string;
  originalUrl: string;
}

interface BaseSuccessResponseBody<T extends Record<string, unknown>> {
  code: "success";
  data: T;
}

export interface FailResponseBody {
  code: "fail";
  error: { message: string };
}

export type SuccessCreateShortUrlResponseBody = BaseSuccessResponseBody<{
  originalUrl: string;
  shortenedUrl: string;
}>;

export async function shortenUrl(originalUrl: string, id?: string) {
  const data: CreateShortUrlRequestBody = { id, originalUrl };
  return await axios.post<SuccessCreateShortUrlResponseBody>(
    `${API_BASE_URL}/short-urls`,
    data
  );
}

export type SuccessGetShortUrlStatisticsResponseBody = BaseSuccessResponseBody<{
  createdAt: string;
  isCustom: boolean;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
}>;

export async function checkStatistics(id: string) {
  return await axios.get<SuccessGetShortUrlStatisticsResponseBody>(
    `${API_BASE_URL}/${id}/stats`
  );
}
