import { objToJson, jsonToObj } from '../util';
import { prisma } from './prisma.client';

export class QuizService {

    async create(quizData: Quiz) {

        const newQuiz = objToJson(quizData);

        // await prisma.quiz.createMany({ data: newQuiz })
        // createMany nao disponivel no SQLite

        for (const data of newQuiz.questions) {
            // @ts-ignore
            await prisma.quiz.create({ data });
        }

        return await this.find();
    }

    async find() {

        const data = await prisma.quiz.findMany();

        // @ts-ignore
        const dataFound = jsonToObj({ questions: data });

        return dataFound;
    }

    async start() {

        const data = await this.find();

        return data;
    }

    async reply(questions: QuizReplyData[]) {

        const questionIds = questions.map(q => q.questionId);

        const allQuestions = await prisma.quiz.findMany({
            where: {
                id: {
                    in: questionIds
                }
            }
        });

        jsonToObj({ questions: allQuestions as unknown as QuizData[] });

        let points = 0;
        let right = 0;
        let wrong = 0;

        for (const id of questionIds) {

            const questionDb = allQuestions.find(i => i.id === id) as unknown as QuizData;

            const answerKeys = Object.keys(questionDb)
                .filter(i => i.includes('answer'))
                .sort() as ('answer1'|'answer2'|'answer3')[];

            const questionReceived = questions
                .find(i => i.questionId === id) as unknown as QuizReplyData;

            const questionReplied = answerKeys[
                Number(questionReceived.questionReplied) - 1
            ];

            if (questionDb[questionReplied].right) {

                points++;
                right++;
            }
            else {
                if (points > 0) points--;
                wrong++;
            }
        }

        return { wrong, right, points };

    }
}
