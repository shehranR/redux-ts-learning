import { createSelector, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import { logout } from "../auth/authSlice";
import { createAppAsyncThunk } from "@/app/withTypes";
import { client } from "@/api/client";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { AppStartListening, startAppListening } from "@/app/listenerMiddleware";


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
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

export const addNewPost = createAppAsyncThunk('posts/addNewPost', async (initialPost: NewPost) => {
    const response = await client.post<Post>('/fakeApi/posts', initialPost);
    return response.data
})

export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
}, {
    condition: (arg, thunkApi) => {
        const postsStatus = selectPostsStatus(thunkApi.getState())
        if(postsStatus !== 'idle') return false;
    }
}
)
interface PostsState extends EntityState<Post, string> {
    status: 'idle' | 'pending' | 'succeeded' | 'failed',
    error: string | null
}

const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState: PostsState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
}) 



const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postUpdated: (state, action: PayloadAction<PostUpdate>) => {
            const {id, title, content} = action.payload;
            postsAdapter.updateOne(state, {id, changes: { title, content }})
        },
        reactionAdded: (state, action: PayloadAction<{postId: string, reaction: ReactionName}>) => {
            const {postId, reaction} = action.payload;
            const existingPost = state.entities[postId]
            if(existingPost) {
                existingPost.reactions[reaction]++
            }
        }  
    },
    extraReducers: (builder) => {
        builder
        .addCase(logout.fulfilled, (state) => initialState)
        .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'pending'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            postsAdapter.setAll(state, action.payload)
        }) 
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message ?? 'Unknown Error'
        })
        .addCase(addNewPost.fulfilled, postsAdapter.addOne)

    }
})

export const { postUpdated, reactionAdded } = postSlice.actions;

export default postSlice.reducer;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
    [
        selectAllPosts,
        (state: RootState, userId: string) => userId
    ],
    (posts, userId) => posts.filter((post) => post.user === userId)
)

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectPostsError = (state: RootState) => state.posts.error


export const addPostsListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        actionCreator: addNewPost.fulfilled,
        effect: async (action, listenerApi) => {
            const { toast } = await import('react-tiny-toast')

            const toastId = toast.show('New post added!', {
                variant: 'success',
                position: 'bottom-right',
                pause: true
            })

            await listenerApi.delay(5000)
            toast.remove(toastId)
        }
    })
}