import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const createHeaders = (
  token?: string,
  contentType: string = "application/json",
) => {
  const headers: HeadersInit = { "Content-type": contentType };
  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const buildQueryParams = (
  params: Record<string, string | number | string[] | undefined>,
) => {
  const queryParams = Object.entries(params)
    .filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== 0 &&
        !(Array.isArray(value) && value.length === 0),
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return queryParams ? `?${queryParams}` : "";
};

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (builder) => ({
    createDocument: builder.mutation({
      query: ({ data }) => ({
        url: "api/documents/",
        method: "POST",
        body: data,
        headers: createHeaders(),
      }),
    }),
    getDocuments: builder.query({
      query: ({ params }) => ({
        url: `api/documents${buildQueryParams(params)}`,
        method: "GET",
        headers: createHeaders(),
      }),
    }),
    getDocumentdata: builder.query({
      query: ({ id }) => ({
        url: `api/documents/${id}`,
        method: "GET",
        headers: createHeaders(),
      }),
    }),
    archiveDocument: builder.mutation({
      query: ({ id }) => ({
        url: `api/documents/${id}`,
        method: "DELETE",
        headers: createHeaders(),
      }),
    }),
    getArchiveDocuments: builder.query({
      query: ({ params }) => ({
        url: `api/documents/archive${buildQueryParams(params)}`,
        method: "GET",
        headers: createHeaders(),
      }),
    }),
    recoverArchivedDocument: builder.mutation({
      query: ({ id }) => ({
        url: `api/documents/archive/${id}`,
        method: "PATCH",
        headers: createHeaders(),
      }),
    }),
    deleteDocument: builder.mutation({
      query: ({ id }) => ({
        url: `api/documents/archive/${id}`,
        method: "DELETE",
        headers: createHeaders(),
      }),
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useGetDocumentdataQuery,
  useArchiveDocumentMutation,
  useGetArchiveDocumentsQuery,
  useRecoverArchivedDocumentMutation,
  useDeleteDocumentMutation,
} = userAuthapi;
