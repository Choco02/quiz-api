import { Request, Response } from 'express';
import { HttpStatus } from '../enums';
import { AccountService } from '../services';
import jwt from 'jsonwebtoken';
import { generatePasswordHash } from '../util';

const account = new AccountService();

export class AccountController {

    static async register(req: Request, res: Response) {

        const data = req.body as RegisterData;

        if (!data.email) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Missing email' });

        if (!data.password) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Missing password' });

        try {

            const user = await account.create({
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role
            });

            const token = jwt.sign(
                { role: user.role, id: `${user.id}` } as Request['userData'],
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            return res.status(HttpStatus.Created).send({
                role: user.role,
                token
            });
        }
        catch(err) {
            // console.log(err);
            return res.status(HttpStatus.Conflict)
                .send({ message: 'Email already registered' });
        }


    }

    static async login(req: Request, res: Response) {

        const data = req.body as RegisterData;

        if (!data.email) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Missing email' });

        if (!data.password) return res.status(HttpStatus.BadRequest)
            .send({ message: 'Missing password' });

        const user = await account.find(data.email);

        if (!user) return res.status(HttpStatus.NotFound)
            .send({ message: 'Account not found' });

        if (user.password !== generatePasswordHash(data.password)) return res
            .status(HttpStatus.Unauthorized)
            .send({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { role: user.role, id: `${user.id}` } as Request['userData'],
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return res.status(HttpStatus.Ok).send({ token });
        // Authorization: Bearer token

    }
}
