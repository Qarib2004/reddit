import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category } from "../components/CategoryTopics";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/categories",
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    
    getCategories: builder.query<Category[], void>({
        query: () => "", 
        
      }),

  
    getCategoryById: builder.query({
      query: (id: string) => `/${id}`,
    }),

    
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/",
        method: "POST",
        body: newCategory,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    
    bulkInsertCategories: builder.mutation({
      query: (categories) => ({
        url: "/bulk",
        method: "POST",
        body: categories,
        headers: { "Content-Type": "application/json" },
      }),
    }),

   
    updateCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedCategory,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

   
    addTopicToCategory: builder.mutation({
      query: ({ id, topic }) => ({
        url: `/${id}/topics`,
        method: "POST",
        body: { topic },
        headers: { "Content-Type": "application/json" },
      }),
    }),

   
    removeTopicFromCategory: builder.mutation({
      query: ({ id, topic }) => ({
        url: `/${id}/topics`,
        method: "DELETE",
        body: { topic },
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useBulkInsertCategoriesMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddTopicToCategoryMutation,
  useRemoveTopicFromCategoryMutation,
} = categoriesApi;
