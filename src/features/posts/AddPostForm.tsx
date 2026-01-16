import React, { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { addNewPost, type Post  } from '@/features/posts/postsSlice'
import { selectCurrentUsername } from '../auth/authSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement,
    postContent: HTMLTextAreaElement,
}

interface AddPostFormElements extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>('idle')
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectCurrentUsername)!

    const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
        e.preventDefault()

        const { elements } = e.currentTarget;

        const form = e.currentTarget

        try {
            setAddRequestStatus('pending')
            await dispatch(addNewPost({title: elements.postTitle.value, content: elements.postContent.value, user: userId})).unwrap()
            
            form.reset()
        } catch(err) {
            console.error(err);
        } finally {
            setAddRequestStatus('idle')
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
                <button>Save Post</button>
            </form>
        </section>
    )
}