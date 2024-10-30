import { User } from "./User";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { Like } from "./Like";

export interface Publication {
    id:number,
    title:string,
    text:string,
    type:number,
    author:User,
    categories:Category[],
    comments:Comment[],
    comments_count:number,
    likes:Like[],
    likes_count:number,
    created_at:string,
    updated_at:string
}

export interface newPublication {
    title:string,
    text:string,
    type:number,
    categories:number[]
}

export interface filterPublication {
    search:string,
    type:string,
    orderBy:string,
    categories:number[],
    state:string,
    city:string,
    neighborhood:string
}