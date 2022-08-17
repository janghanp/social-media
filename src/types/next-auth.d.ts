import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
// To avoid session is possibly undefined.
declare module 'next-auth' {
  interface Session {
    expires: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name: string;
    username: string | null;
    email: string;
    picture: string;
    sub: string;
    iat: number;
    exp: number;
    jti: string;
  }
}
