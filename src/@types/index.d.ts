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

interface QuizData {
    question: string;
    category: string;
    answer1: {
        content: string;
        right: boolean;
    };
    answer2: {
        content: string;
        right: boolean;
    };
    answer3: {
        content: string;
        right: boolean;
    }
}

interface Quiz {
    questions: QuizData[]
}

interface ValidatedReturn {
    validated: boolean,
    err: string
}
