// mongo.ts

import mongoose from 'mongoose';

export const mongoConnect = async (uri: string) => {
    try {
        await mongoose.connect(uri);
    } catch (error) {
    }
};

export const mongoDisconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
    }
};
