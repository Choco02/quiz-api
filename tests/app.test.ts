// import { app } from '../src/app';
import axios, { AxiosError } from 'axios';
import { HttpStatus } from '../src/enums';
import { router } from '../src/routes';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const server = app.listen(3000);

axios.defaults.baseURL = 'http://localhost:3000';

beforeAll(async () => {
    
    // TODO
    await prisma.user.deleteMany({});

});

afterAll(() => server.close());

describe('register route', () => {

    test('missing email', async () => {

        await axios.post('/register', {})
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.BadRequest);
                expect(err.response?.data).toEqual({ message: 'Missing email' });
            });

    });

    test('missing password', async () => {

        await axios.post('/register', {
            email: 'johnsmith@yahoo.com'
        })
            .catch((err: AxiosError) => {
                expect(err.response?.data).toEqual({ message: 'Missing password' });
            });
    });

    test('creating user', async () => {

        const email = 'onlytest@test';
        const password = 'passwordtest';

        const createdUser = await axios.post('/register', {
            email,
            password,
        });
    
        expect(createdUser.data).toHaveProperty('token');
        expect(createdUser.status).toBe(HttpStatus.Created);

        await axios.post('/register', {
            email,
            password,
        })
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.Conflict);
                expect(err.response?.data).toEqual({ message: 'Email already registered' });
            });

        const createdAdm = await axios.post('/register', {
            email: 'admin@test',
            password: 'passwordadm',
            role: 'admin'
        });

        expect(createdAdm.data).toHaveProperty('role', 'admin');
    });

});

describe('login route', () => {

    const email = 'onlytest@test';
    const password = 'passwordtest';

    test('missing email', async () => {

        await axios.post('/login')
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.BadRequest);
                expect(err.response?.data).toEqual({ message: 'Missing email' });
            });

    });

    test('account not found', async () => {

        await axios.post('/login', {
            email: 'wrong@email',
            password
        })
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.NotFound);
                expect(err.response?.data).toEqual({ message: 'Account not found' });
            });

    });

    test('missing password', async () => {

        await axios.post('/login', {
            email,
        })
            .catch((err: AxiosError) => {
                expect(err.response?.data).toEqual({ message: 'Missing password' });
            });

    });

    test('wrong password', async () => {

        await axios.post('/login', {
            email,
            password: 'wrongpassword'
        })
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.Unauthorized);
                expect(err.response?.data).toEqual({ message: 'Invalid email or password' });
            });


    });

    test('finding user by email', async () => {

        const response = await axios.post('/login', { email, password });

        expect(response.status).toBe(HttpStatus.Ok);
        expect(response.data).toHaveProperty('token');

    });

});

describe('quiz route', () => {

    
    const adminEmail = 'admin@test';
    const adminPassword = 'passwordadm';

    const getAdminCredentials = async () => {

        const { token } = await axios.post('/login', {
            email: adminEmail,
            password: adminPassword
        }).then(r => r.data as { token: string });

        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };

        return config;
    };

    test('missing admin role', async () => {

        const playerEmail = 'onlytest@test';
        const playerPassword = 'passwordtest';

        const { token } = await axios.post('/login', {
            email: playerEmail,
            password: playerPassword
        }).then(r => r.data as { token: string });


        await axios.post('/create-questions', {}, {
            headers:{
                Authorization: 'Bearer ' + token,
            }
        })
            .catch((err: AxiosError) => {

                expect(err.response?.status).toBe(HttpStatus.Forbidden);
                expect(err.response?.data).toEqual({ message: 'You need admin role' });

            });

    });

    test('no questions sent', async () => {

        await axios.post('/create-questions', {}, await getAdminCredentials())
            .catch((err: AxiosError) => {
                expect(err.response?.status).toBe(HttpStatus.BadRequest);
            });

    });

});
