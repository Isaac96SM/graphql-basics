import { ctx } from "../models"

export const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }: ctx) {
            const post = db.posts.find(p => p.id === postId && p.published)

            if (!post)
                throw new Error('Post not found')

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { db, pubsub }: ctx) {
            return pubsub.asyncIterator('post')
        }
    }
}
