import crypto from 'crypto';

export const generatePasswordHash = (password: string): string => {

    const hash = crypto
        .createHmac('sha256', process.env.PASSWORD_SALT as string)
        .update(password)
        .digest('hex');

    return hash;

};
