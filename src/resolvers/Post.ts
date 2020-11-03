import { ctx } from "../models"

export const Post = {
    author(parent, args, { db }: ctx) {
        return db.users.find(u => u.id === parent.author)
    },
    comments(parent, args, { db }: ctx) {
        return db.comments.filter(c => c.post === parent.id)
    }
}