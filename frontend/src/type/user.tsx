export interface LoginType {
    accessToken: string,
    refreshToken: string,
}

export interface LoginForm {
    email: string,
    password: string,
}

export interface ChangePasswordForm {
  old_password?: string;
  password: string;
  confirm_password:string;
  invite_token?:string;
}



export type UserFields = {
  id: string;
  name: string;
  email: string;
  role: string;
  tasks?: Array<string>;
  profile_pic?: string;
};
