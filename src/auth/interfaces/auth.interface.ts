export interface IAuthenticationResult {
  access_token: string;
  user: any;
}

export interface IAuthService {
  validateUser(login: string, password: string): Promise<any>;
  login(user: any): Promise<IAuthenticationResult>;
}
