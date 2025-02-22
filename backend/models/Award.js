import mongoose from "mongoose";


const AwardSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number, 
    image: String,
  });



  export default  mongoose.model("Award", AwardSchema);