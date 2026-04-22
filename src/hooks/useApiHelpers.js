export const getApiPayload = (response, fallbackMessage) => {
  const body = response?.data;
  if (typeof body?.success === "boolean") {
    if (body.success) {
      return body.data ?? body;
    }
    throw new Error(body.message || fallbackMessage || "Request failed");
  }
  return body?.data ?? body;
};

export const makeDomainKeys = (domain) => ({
  all: [domain],
  lists: () => [domain, "list"],
  list: (params = {}) => [domain, "list", params],
  details: () => [domain, "detail"],
  detail: (id) => [domain, "detail", id],
});
