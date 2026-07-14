import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  reducerPath: "adminAPI",
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/api/general/user/${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = api;
