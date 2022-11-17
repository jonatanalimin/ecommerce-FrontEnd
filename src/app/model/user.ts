export interface UserManagementGetAllResp{
    id:number,
    username: string,
    password: string,
    role: string,
    enabled: boolean,
    passwordChangedTime: Date,
    failedAttempt: number,
    locked: boolean,
    lockTime: Date
}

export interface User {
    username:String,
    password:String
}

export interface LoginResp {
    id:number,
    username:String,
    auth:String,
    role:String,
    error:String
}

export class UserModel {
    constructor(
        public username: string,
        public password: string
    ){}
}