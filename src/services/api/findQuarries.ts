import axios from "axios";
import { FindQuarriesReturnDto } from "./types";

export const findQuarriesApi = async (imageBase64: string | null) => {
  if (!imageBase64) return null;
  if (!process.env.NEXT_PUBLIC_API_KEY) throw new Error("Api key required");

  const { data } = await axios({
    method: "POST",
    url: "https://detect.roboflow.com/finding-quarries/4",
    params: { api_key: process.env.NEXT_PUBLIC_API_KEY, confidence: 0.01 },
    data: imageBase64,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data as FindQuarriesReturnDto;
};
