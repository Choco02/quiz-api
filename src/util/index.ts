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

        if (answers.length !== 3) {
            return { validated: false, err: 'Invalid answers length' };
        }

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

export const shuffle = (array: QuizData[]) => {

    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};

export const validateReply = (data: QuizReply) => {

    for (const d of data.questions) {

        if (typeof d.questionId !== 'number') {
            return { validated: false, err: `questionId is not a number at questions[${data.questions.indexOf(d)}]` };
        }
        if (![ '1', '2', '3' ].includes(d.questionReplied)) {
            return { validated: false, err: 'questionReplied need to be "1", "2" or "3"' };
        }

    }

    return { validated: true, err: '' };

};
