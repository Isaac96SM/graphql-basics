import { v4 } from "uuid"

import { ctx, Post } from "../models"

export const Mutation = {
    createUser(parent, args, { db }: ctx) {
        const emailTaken = db.users.some(u => u.email === args.data.email)

        if (emailTaken)
            throw new Error('email already in use')
        
        const user = {
            id: v4(),
            ...args.data
        }

        db.users.push(user)

        return user
    },
    deleteUser(parent, args, { db }: ctx) {
        const userIndex = db.users.findIndex(u => u.id === args.id)

        if (userIndex < 0)
            throw new Error('User not found')

        const deleted = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter(p => {
            const match = p.author === args.id

            if (match) {
                db.comments = db.comments.filter(c => c.post !== p.id)
            }

            return !match
        })
        db.comments = db.comments.filter(c => c.author !== args.id)

        return deleted[0]
    },
    updateUser(parent, args, { db }: ctx) {
        const { id, data } = args
        const user = db.users.find(u => u.id === id)

        if (!user)
            throw new Error('User not found')

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(u => u.email === data.email)

            if (emailTaken)
                throw new Error('Email taken')

            user.email = data.email
        }

        if (typeof data.name === 'string')
            user.name = data.name

        if (typeof data.age !== 'undefined')
            user.age = data.age

        return user
    },
    createPost(parent, args, { db, pubsub }: ctx) {
        const userExists = db.users.some(u => u.id === args.data.author)

        if (!userExists)
            throw new Error('User not found')

        const post: Post = {
            id: v4(),
            ...args.data
        }

        db.posts.push(post)

        if (post.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })

        return post
    },
    deletePost(parent, args, { db, pubsub }: ctx) {
        const postIndex = db.posts.findIndex(p => p.id === args.id)

        if (postIndex < 0)
            throw new Error('Post not found')

        const [post] = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter(c => c.post !== args.id)

        if (post.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })

        return post
    },
    updatePost(parent, args, { db, pubsub }: ctx) {
        const { id, data } = args
        const post = db.posts.find(p => p.id === id)
        const originalPost = { ...post }

        if (!post)
            throw new Error('Post not found')

        if (typeof data.title === 'string')
            post.title = data.title
        
        if (typeof data.body === 'string')
            post.body = data.body

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published)
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            else if (!originalPost.published && post.published)
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }: ctx) {
        const postExists = db.posts.some(p => p.id === args.data.post && p.published)
        const userExists = db.users.some(u => u.id === args.data.author)

        if (!postExists)
            throw new Error('Post not found or not published')

        if (!userExists)
            throw new Error('User not found')

        const comment = {
            id: v4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },
    deleteComment(parent, args, { db, pubsub }: ctx) {
        const commentIndex = db.comments.findIndex(c => c.id === args.id)

        if (commentIndex < 0)
            throw new Error('Comment not found')

        const [deleted] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deleted.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deleted
            }
        })

        return deleted[0]
    },
    updateComment(parent, args, { db, pubsub }: ctx) {
        const { id, data } = args
        const comment = db.comments.find(c => c.id === id)

        if (!comment)
            throw new Error('Comment not found')

        if (typeof data.text === 'string')
            comment.text = data.text

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}
