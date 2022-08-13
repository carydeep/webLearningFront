export interface User{
    _id: string,
  username: string,
  email: string,
  firstname: string,
  lastname: string,
  role: string,
  createdAt?: string,
  updatedAt: string,
  __v?: number,
  accessToken:string
}

export interface RegisterUser{
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
}

export interface AllUser{
  username:string,
  _id:string
}