import React from "react";
import { useState, useEffect } from "react";
import './post.styles.css'
import { Avatar, Button } from "@material-ui/core";

const BASE_URL = 'http://localhost:8000/'


const Post = ({ post, authToken, authTokenType, username }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (post.image_url_type == 'absolute') {
            setImageUrl(post.image_url)
        } else {
            setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    useEffect(() => {
        setComments(post.comments)
    }, [])

    const handleDelete = (event) => {
        event?.preventDefault();

        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken
            })
        }

        fetch(BASE_URL + 'post/' + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload()
                }
                throw response
            })
            .catch(error => {
                console.log(error)
            })
    }

    const postComment = (event) => {
        event?.preventDefault()

        const json_string = JSON.stringify({
            'username': username,
            'user_comment': newComment,
            'post_id': post.id,
        })

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType +  ' ' + authToken,
                'Content-Type': 'application/json'
            }),
            body: json_string
        }

        fetch(BASE_URL + 'comment', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(data => {
                window.location.reload()
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setNewComment('')
            })
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar alt="ash" src="" />
                <div className="post_header_info">
                    <h3>{post.user.username}</h3>
                    <Button className="post-delete" onClick={handleDelete}>Delete</Button>
                </div>
            </div>
            <img className="post_image" alt={`${imageUrl}`} src={imageUrl}/>

            <h4 className="post_text">{post.caption}</h4>
            <div className="post_comments">

                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}:</strong> {comment.user_comment}
                        </p>
                    ))
                }
            </div>
            {authToken && (
                <form className="post_commentbox">
                    <input className="post_input"
                        type='text'
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                    className="post_button"
                    type="submit"
                    disabled={!newComment}
                    onClick={postComment}>
                        Post
                    </button>  
                </form>
                
            )}
        </div>
    )
}

export default Post