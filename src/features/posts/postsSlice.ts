import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import { userLoggedOut } from "../auth/authSlice";


export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions
const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0
}


export interface Post {
    id: string,
    title: string,
    content: string,   
    user: string,
    date: string,
    reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

const initialState: Post[] = [
  { id: '1', title: 'First Post!', content: 'Hello!', user: '0' ,  date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: initialReactions},
  { id: '2', title: 'Second Post', content: 'More text', user: '2', date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: initialReactions}
]


const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer: (state, action: PayloadAction<Post>) => {
                state.push(action.payload);
            },
            prepare: (title: string, content: string, userId: string) => {
                return {payload: {id: nanoid(), title, content, user: userId, date: new Date().toISOString(), reactions: initialReactions}};
            }
        },
        postUpdated: (state, action: PayloadAction<PostUpdate>) => {
            const {id, title, content} = action.payload;
            const existingPost = state.find((post) => post.id == id);
            if(existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded: (state, action: PayloadAction<{postId: string, reaction: ReactionName}>) => {
            const {postId, reaction} = action.payload;
            const existingPost = state.find((post) => post.id === postId)
            if(existingPost) {
                existingPost.reactions[reaction]++
            }
        }  
    },
    extraReducers: (builder) => {
        builder.addCase(userLoggedOut, (state) => []);
    }
})

export const { postAdded, postUpdated, reactionAdded } = postSlice.actions;

export default postSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts

export const selectPostById = (state: RootState, postId: string) => state.posts.find((post) => post.id === postId)