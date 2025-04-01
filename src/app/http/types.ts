export type UserType = {
  username: string;
  email?: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserType;
};
