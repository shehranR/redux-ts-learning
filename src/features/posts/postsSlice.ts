import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
    id: string,
    title: string,
    content: string;    
}

const initialState: Post[] = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]


const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: (state, action: PayloadAction<Post>) => {
            state.push(action.payload);
        }
    }
})

export const { postAdded } = postSlice.actions;

export default postSlice.reducer;