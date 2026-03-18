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

  export interface SignUpPayload {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
  }
