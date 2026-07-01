import { handler } from "@/lib/auth-server";

type Handler = (request: Request) => Promise<Response>;

function stripExpectHeader(handle: Handler): Handler {
  return async (request: Request) => {
    const headers = new Headers(request.headers);
    headers.delete("expect");
    const strippedRequest = new Request(request, { headers });
    return handle(strippedRequest);
  };
}

export const GET = stripExpectHeader(handler.GET);
export const POST = stripExpectHeader(handler.POST);
