export interface User {
    id:number,
    name:string,
    email:string,
    cpf:string,
    state:string,
    city:string,
    neighborhood:string,
    categories:number[],
    created_at:string,
    updated_at:string
}

export interface registerUser {
    name:string,
    email:string,
    password:string,
    cpf:string,
    state:string,
    city:string,
    neighborhood:string,
    categories: number[],
}