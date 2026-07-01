import { handler } from "@/lib/auth-server";

type Handler = (request: Request) => Promise<Response>;

function stripExpectHeader(handle: Handler): Handler {
  return async (request: Request) => {
    const headers = new Headers(request.headers);
    headers.delete("expect");

    const method = request.method;
    let body: ArrayBuffer | undefined;
    if (method !== "GET" && method !== "HEAD") {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > 0) {
        body = buffer;
      }
    }

    const strippedRequest = new Request(request.url, {
      method,
      headers,
      body,
    });

    return handle(strippedRequest);
  };
}

export const GET = stripExpectHeader(handler.GET);
export const POST = stripExpectHeader(handler.POST);
