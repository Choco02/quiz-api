import { Request, Response } from 'express';
import { HttpStatus } from '../enums';
import { QuizService } from '../services/quiz.service';
import { hideCorrectAnswers, validateQuestions } from '../util';

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

}
