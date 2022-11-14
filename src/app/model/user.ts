export interface User {
    username:String,
    password:String
}

export interface LoginResp {
    id:number,
    username:String,
    role:String,
    errorMessage:String
}

export class UserModel {
    constructor(
        public username: string,
        public password: string
    ){}
}