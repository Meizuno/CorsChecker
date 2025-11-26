export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await fetch(body.url, {
    method: body.method,
  });
  return {
    status: response.status,
    headers: [
      {
        key: "server",
        value: response.headers.get("server") || null,
      },
      {
        key: "content-type",
        value: response.headers.get("content-type") || "--",
      },
      {
        key: "access-control-allow-credentials",
        value: response.headers.get("access-control-allow-credentials") || null,
      },
      {
        key: "access-control-allow-headers",
        value: response.headers.get("access-control-allow-headers") || null,
      },
      {
        key: "access-control-allow-methods",
        value: response.headers.get("access-control-allow-methods") || null,
      },
    ],
    body: {
      data: await response.text(),
    },
  };
});
