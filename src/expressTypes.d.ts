declare global {
  namespace Express {
    export interface Request {
      user?: { userId: string; email: string; username: string };
    }
  }
}
// declare module "express-session" {
//   export interface SessionData {
//     lastQuery: unknown;
//   }
// }
