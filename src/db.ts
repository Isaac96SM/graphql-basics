import { Db } from "./models"

const users = [
    {
        id: '1',
        name: 'John',
        email: 'john@mail.com',
        age: 35
    },
    {
        id: '2',
        name: 'Peter',
        email: 'peter@mail.com'
    },
    {
        id: '3',
        name: 'Helen',
        email: 'helen@mail.com',
        age: 25
    }
]

const posts = [
    {
        id: "1",
        title: "Post by John",
        body: "Hello, I'm John",
        published: true,
        author: '1'
    },
    {
        id: "2",
        title: "Post by Peter",
        body: "Hello, I'm Peter",
        published: false,
        author: '2'
    },
    {
        id: "3",
        title: "Post by Helen",
        body: "Hello, I'm Helen",
        published: true,
        author: '3'
    }
]

const comments = [
    {
        id: '1',
        text: 'Nice to meet you John!',
        author: '3',
        post: '1'
    },
    {
        id: '2',
        text: 'Nice to meet you Helen!',
        author: '2',
        post: '3'
    },
    {
        id: '3',
        text: 'Welcome John',
        author: '2',
        post: '1'
    },
    {
        id: '4',
        text: 'Thanks Peter',
        author: '3',
        post: '3'
    }
]

const db: Db = {
    users,
    posts,
    comments
}

export { db as default }
