import React from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { type Post, postAdded } from '@/features/posts/postsSlice'
import { selectCurrentUsername } from '../auth/authSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement,
    postContent: HTMLTextAreaElement,
}

interface AddPostFormElements extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectCurrentUsername)!

    const handleSubmit = (e: React.FormEvent<AddPostFormElements>) => {
        e.preventDefault()

        const { elements } = e.currentTarget;
        dispatch(postAdded(elements.postTitle.value, elements.postContent.value, userId));

        e.currentTarget.reset();
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
                <button>Save Post</button>
            </form>
        </section>
    )
}