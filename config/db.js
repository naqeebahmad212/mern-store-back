const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://soomrush212:ahmadjan1@my-cluster.i0gyfov.mongodb.net/mynew?retryWrites=true&w=majority"
    );
    console.log(`connected to ${process.env.DB_URI}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectDB,
};
