import jwt from 'jsonwebtoken';

const secretKey = 'SecretKey';

export const generateToken = (payload: any): string => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
