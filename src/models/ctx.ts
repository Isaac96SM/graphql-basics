import { PubSub } from "graphql-yoga"

import { Db } from "./"

export interface ctx {
    db: Db
    pubsub: PubSub
}
