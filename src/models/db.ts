export interface User {
    id: string
    email: string
    name: string
    age?: number
}

export interface Post {
    id: string
    title: string
    body: string
    published: boolean
    author: string
}

export interface Comment {
    id: string
    text: string
    author: string
    post: string
}

export interface Db {
    users: User[]
    posts: Post[]
    comments: Comment[]
}
