import React, {useEffect, useState} from "react";

import { Post } from "../components/Post";
import {useParams} from "react-router-dom";
import axios from "../axios";

export const FullPost = () => {
    const {id} = useParams()
    const [post, setPosts] = useState()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        console.log(1)
        axios.get(`/post/6480cbf6edbbd5d1290df731`).then((res) => {
            setPosts(res.data)
            setIsLoading(false)
        }).catch((err) => {
            alert(err)
        })
    }, [])

    if (!isLoading) {
        return <Post isLoading={isLoading} />
    }

  return (
    <>
      <Post
          _id={post._id}
          title={post.title}
          imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
          user={post.user}
          createdAt={post.createAdt}
          viewsCount={post.viewsCount}
          commentsCount={3}
          tags={post.tags}
        isFullPost
      >
        <p>{post.text}</p>
      </Post>
    </>
  );
};
