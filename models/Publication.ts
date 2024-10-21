import { User } from "./User";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { Like } from "./Like";

export interface Publication {
    id:number,
    title:string,
    text:string,
    author:User,
    categories:Category[],
    comments:Comment[],
    likes:Like[],
    created_at:string,
    updated_at:string
}