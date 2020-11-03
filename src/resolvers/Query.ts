import { includes } from "../functions"
import { ctx } from "../models"

export const Query = {
    users(parent, args: { query?: string }, { db }: ctx) {
        return args.query
            ? db.users.filter(u => includes(u, 'name', args.query))
            : db.users
    },
    posts(parent, args: { query?: string }, { db }: ctx) {
        return args.query
            ? db.posts.filter(p => includes(p, 'title', args.query) || includes(p, 'body', args.query))
            : db.posts
    },
    comments(parent, args, { db }: ctx) {
        return db.comments
    }
}
