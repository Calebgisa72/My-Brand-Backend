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

export const testMongoConnect = async(uri:string) =>{
    if (uri) {
        try {
          await mongoose.connect(uri);
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
        }
      } else {
        console.error("TEST_MONGODB_URI environment variable is not defined.");
      }
}

export const testMongoClose = async() =>{
    await mongoose.connection.close();
}
