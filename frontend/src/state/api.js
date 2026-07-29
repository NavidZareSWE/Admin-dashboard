import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  reducerPath: "adminAPI",
  tagTypes: ["User", "Products", "Customers"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/api/general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "/api/client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "/api/client/customers",
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetUserQuery, useGetProductsQuery, useGetCustomersQuery } =
  api;
