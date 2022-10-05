declare namespace Express {
    export interface Request {
        userData: {
            role: 'player' | 'admin';
            id: string;
        }
    }
}

interface RegisterData {
    email: string;
    password: string;
    name?: string;
    role?: string;
}
