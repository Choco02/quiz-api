import { Router, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { HttpStatus } from './enums';
import { AccountController } from './controllers';

const router = Router();

const authenticate = (req: Request, res: Response, next: NextFunction) => {

    if (['register', 'login'].some(route => req.path.includes(route))) {
        return next();
    }

    if (!req.headers.authorization) {
        return res.status(HttpStatus.Unauthorized).send({ message: 'Authentication needed' });
    }

    const [, token ] = req.headers.authorization.split(' ');

    try {
        const userData = jwt.verify(token, process.env.SECRET as string) as Request['userData'];
        req.userData = userData;

    }
    catch (err) {
        return res.status(HttpStatus.Unauthorized).send({ message: 'Authentication needed' });
    }


    next();
};

router.use(helmet());
router.use(authenticate);


router.post('/register', AccountController.register);
router.post('/login', AccountController.login);

export { router };
