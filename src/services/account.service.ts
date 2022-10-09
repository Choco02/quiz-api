import { prisma } from './prisma.client';
import { generatePasswordHash } from '../util';
export class AccountService {

    async create(data: RegisterData) {

        const dataToSave = {
            email: data.email,
            password: generatePasswordHash(data.password)
        } as { email: string, password: string, name?: string, role?: string };

        if (data.name) dataToSave.name = data.name;
        if (data.role && data.role === 'admin') dataToSave.role = data.role;

        return await prisma.user.create({
            data: dataToSave
        });
    }

    async find(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    update() {
        // TODO
    }

    delete() {
        // TODO
    }
}
