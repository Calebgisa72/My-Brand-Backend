// mongo.ts

import mongoose from 'mongoose';

export const mongoConnect = async (uri: string) => {
    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export const mongoDisconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};
