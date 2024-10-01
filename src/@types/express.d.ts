import { userId } from '../types/type';

declare global {
    namespace Express {
        export interface Request {
            user: userId;
        }
    }
}
