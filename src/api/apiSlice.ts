import type { NewPost, Post } from "@/features/posts/postsSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export type {Post}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi'}),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        getPosts: builder.query<Post[], void>({
            query: () => '/posts',
            providesTags: ['Post']
        }),
        getPost: builder.query<Post, string>({
            query: (postId) => `/posts/${postId}`,
            providesTags: ['Post']
        }),
        addNewPost: builder.mutation<Post, NewPost>({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: initialPost
            }),
            invalidatesTags: ['Post']
        })
    })
})

export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } = apiSlice