export interface User {
    id: string;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  }

  export interface SignInPayload {
    username: string;
    password: string;
    remember?: boolean;
  }
