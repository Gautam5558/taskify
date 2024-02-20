import mongoose from "mongoose";

let isConnected: boolean = false;

export async function connectDb() {
  mongoose.set("strictQuery", true);

  if (!process.env.NEXT_MONGO_URL) {
    return console.log("mongoDb url is undefined");
  }

  if (isConnected) {
    return console.log("Already connected to mongoDb");
  }
  try {
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    isConnected = true;
    console.log("connected to mongoDb");
  } catch (err) {
    console.log(err);
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("mongoDb disconnected");
});
