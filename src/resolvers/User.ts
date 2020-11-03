import { ctx } from "../models"

export const User = {
    posts(parent, args, { db }: ctx) {
        return db.posts.filter(p => p.author === parent.id)
    },
    comments(parent, args, { db }: ctx) {
        return db.comments.filter(c => c.author === parent.id)
    }
}
