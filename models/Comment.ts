import { User } from "./User";

export interface Comment {
    id:number,
    comment:string,
    publication_id:number,
    user_id:number,
    author:User,
    created_at:string,
    updated_at:string
}