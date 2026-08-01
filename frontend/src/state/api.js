import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  reducerPath: "adminAPI",
  tagTypes: ["User", "Products", "Customers", "Transactions", 'Geography'],
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
    // The query function receives an object containing pagination, sorting,
    // and search values. We destructure those values so we can use them
    // when building the API request.
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "/api/client/transactions",
        method: "GET",

        // Attach the extracted values as URL query parameters.
        // This converts them into:
        // /api/client/transactions?page=1&pageSize=10&sort=desc&search=test
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "/api/client/geography",
      providesTags: ["Geography"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery
} = api;
