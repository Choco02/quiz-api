import crypto from 'crypto';

export const generatePasswordHash = (password: string): string => {

    const hash = crypto
        .createHmac('sha256', process.env.PASSWORD_SALT as string)
        .update(password)
        .digest('hex');

    return hash;

};

export const validateQuestions = (data: Quiz) => {

    for (const question of data.questions) {

        if (!question.question) {
            return { validated: false, err: 'Question is missing' };
        }

        if (!question.category) {
            return { validated: false, err: 'Category is missing' };
        }

        const answers: string[] = Object.keys(question)
            .filter(i => i.includes('answer'));

        const filterQuestions = (option: boolean) => {
            return answers.filter(
                // @ts-ignore
                (a: string) => question[a].right === option);
        };

        const correctAnswers = filterQuestions(true);

        const wrongAnswers = filterQuestions(false);

        if (correctAnswers.length > 1) {
            return { validated: false, err: `Only one question can be correct at questions[${data.questions.indexOf(question)}]` };
        }

        if (wrongAnswers.length > 2) {
            return { validated: false, err: `No question is correct at questions[${data.questions.indexOf(question)}]` };
        }

    }

    return { validated: true, err: '' };

};

export const objToJson = (data: Quiz) => {

    for (const question of data.questions) {

        const answers = Object.keys(question).filter(i => i.includes('answer'));

        for (const answerKey of answers) {

            // @ts-ignore
            question[answerKey] = JSON.stringify(question[answerKey]);

        }

    }

    return data;
};

export const jsonToObj = (data: Quiz) => {

    for (const question of data.questions) {

        const answers = Object.keys(question).filter(i => i.includes('answer'));

        for (const answerKey of answers) {

            // @ts-ignore
            question[answerKey] = JSON.parse(question[answerKey]);

        }

    }

    return data;
};

export const hideCorrectAnswers = (data: Quiz) => {

    for (const question of data.questions) {

        const answers = Object.keys(question).filter(i => i.includes('answer'));

        for (const answerKey of answers) {

            // @ts-ignore
            delete question[answerKey].right;
        }

    }

    return data;
};
