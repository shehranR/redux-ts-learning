import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Link } from "react-router-dom";
import { fetchPosts, type Post, selectAllPosts, selectPostById, selectPostIds, selectPostsError, selectPostsStatus } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import React, { useEffect } from "react";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "@/components/TimeAgo";
import { Spinner } from "@/components/Spinner";

interface PostExcerptProps {
    postId: string
}

type Elemtype = (arg: PostExcerptProps) => React.ReactNode

let PostExcerpt: Elemtype = ({ postId }: PostExcerptProps) => {
    const post = useAppSelector((state) => selectPostById(state, postId))
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post} />
        </article>
    )
}

PostExcerpt = React.memo(PostExcerpt) 

export const PostsList = () => {
    const dispatch = useAppDispatch()
    const orderedPostIds = useAppSelector(selectPostIds)
    const posts = useAppSelector(selectAllPosts)
    const postStatus = useAppSelector(selectPostsStatus)
    const postsError = useAppSelector(selectPostsError)

    useEffect(() => {
        if (postStatus == 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch])

    let content: React.ReactNode

    if (postStatus === 'pending') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    } else if (postStatus === 'failed') {
        content = <div>{postsError}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}