import { Category } from "./Category";
import { Publication } from "./Publication";

export interface User {
    id:number,
    name:string,
    email:string,
    cpf:string,
    state:string,
    city:string,
    neighborhood:string,
    categories:Category[],
    created_at:string,
    updated_at:string
}

export interface FullUser {
    id:number,
    name:string,
    email:string,
    cpf:string,
    state:string,
    city:string,
    neighborhood:string,
    categories:Category[],
    publications: Publication[],
    created_at:string,
    updated_at:string
}

export interface FormUser {
    name:string,
    email:string,
    password:string,
    cpf:string,
    state:string,
    city:string,
    neighborhood:string,
    categories: number[],
}

export interface filterUser {
    search:string,
    categories:number[],
    state:string,
    city:string,
    neighborhood:string
}