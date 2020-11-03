import { ctx } from "../models"

export const Comment = {
    author(parent, args, { db }: ctx) {
        return db.users.find(u => u.id === parent.author)
    },
    post(parent, args, { db }: ctx) {
        return db.posts.find(p => p.id === parent.post)
    }
}
