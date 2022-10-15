import { Request, Response } from 'express';
import { HttpStatus } from '../enums';
import { QuizService } from '../services/quiz.service';
import { hideCorrectAnswers, shuffle, validateQuestions, validateReply } from '../util';

const quiz = new QuizService();

export class QuizController {

    static async create(req: Request, res: Response) {

        const data = req.body as Quiz;

        if (req.userData.role !== 'admin') return res.status(HttpStatus.Forbidden)
            .send({ message: 'You need admin role' });

        if (!data.questions) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Any question received' });

        const { validated, err } = validateQuestions(data) as ValidatedReturn;

        if (!validated) return res.status(HttpStatus.BadRequest)
            .send({ message: err });

        return await res.status(HttpStatus.Created)
            .send({ questions: (await quiz.create(data)).questions });
    }

    static async find(req: Request, res: Response) {

        const data = await quiz.find();

        if (req.userData.role !== 'admin') hideCorrectAnswers(data);

        return res.status(HttpStatus.Ok).send({ questions: data.questions });
    }

    static async start(req: Request, res: Response) {

        const data = await quiz.start();

        if (data.questions.length < 10) {

            const neededQuestions = 10 - data.questions.length;

            return res
                .status(HttpStatus.Conflict)
                .send({
                    message: 'Insufficient number of registered questions, '+
                    `${neededQuestions} more questions needed`
                });
        }

        if (req.userData.role !== 'admin') hideCorrectAnswers(data);

        const pickedQuestions = shuffle(data.questions).slice(0, 10);

        res.status(HttpStatus.Ok).send({ questions: pickedQuestions });

    }

    static async reply(req: Request, res: Response) {

        const data = req.body as QuizReply;

        if (!data?.questions) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Missing questions' });

        if (data.questions.length < 10) return res.status(HttpStatus.BadRequest)
            .send({ message: '10 questions is required' });

        const { validated, err } = validateReply(data);

        if (!validated) return res.status(HttpStatus.BadRequest)
            .send({ message: err });

        res.status(HttpStatus.Ok).send(await quiz.reply(data.questions, req.userData));

    }
}
