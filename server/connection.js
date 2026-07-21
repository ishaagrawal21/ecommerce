const { default: mongoose } = require("mongoose");
const seedAdmin = require("./utils/seedAdmin");

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Blogweb";
    const connect = await mongoose.connect(mongoUri);
    console.log("DB Connected");
    await seedAdmin();
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
