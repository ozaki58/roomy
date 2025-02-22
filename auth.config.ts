import type { NextAuthConfig } from "next-auth";

// // 保護したいパスを配列で定義（必要に応じて追加してください）
// const protectedRoutes = ["/createGroup", "/group", "/profile", "/home" , "/searchGroup","/notification"];

export const authConfig = {
  pages: {
    signIn: '/home',
  },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       // 保護対象のパスなら、ログイン状態をチェック
//       if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
//         return isLoggedIn;
//       }
//       // それ以外のパスは公開する
//       return true;
//     },
//   },
  providers: [],
} satisfies NextAuthConfig;
