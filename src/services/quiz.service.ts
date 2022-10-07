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
}
