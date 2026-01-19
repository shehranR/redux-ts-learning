import React, { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { addNewPost, type Post  } from '@/features/posts/postsSlice'
import { selectCurrentUsername } from '../auth/authSlice'
import { useAddNewPostMutation } from '@/api/apiSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement,
    postContent: HTMLTextAreaElement,
}

interface AddPostFormElements extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const userId = useAppSelector(selectCurrentUsername)!
    const [addNewPost, {isLoading}] = useAddNewPostMutation()

    const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
        e.preventDefault()

        const { elements } = e.currentTarget;

        const form = e.currentTarget

        try {
            await addNewPost({ title: elements.postTitle.value, content: elements.postContent.value, user: userId})
            form.reset()
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" defaultValue="" required />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    defaultValue=""
                    required
                />
                <button disabled={isLoading}>Save Post</button>
            </form>
        </section>
    )
}