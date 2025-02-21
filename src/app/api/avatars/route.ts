import { NextRequest, NextResponse } from "next/server";
//import { useAuth } from "@clerk/clerk-react";
import {
  GetHeaders,
  EmptyHeader,
  MutateOptions,
  fetchData,
  getHeadersInitializer,
  postData,
  putData,
} from "../../nextapi/utils";
import {
  AvatarData,
  AvatarOperationData,
  CreateAvatarData,
  CreateAvatarOperationRequestData,
  UpdateAvatarData,
} from "../../nextapi/avatars/models";

const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;

if (!FUNCTION_APP_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUNCTION_APP_URL in environment variables"
  );
}

export async function GET(req: NextRequest) {
  console.log("Executing GET request for /api/avatars");
  //const { getToken } = useAuth();
  try {
    return Response.json(
      fetchData<AvatarData[]>(`${FUNCTION_APP_URL}/api/avatars`, async () => {
        return {};
      })
    );
  } catch (error) {
    return new Response("Failed to fetch data from Azure Function!", {
      status: 500,
    });
  }
}
