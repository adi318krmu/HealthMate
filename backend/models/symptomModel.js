const{ Schema , model}= require('mongoose')

const SymSchema= new Schema({
    name:{
   type: String,
   required : true,

    },
      createdAt: {
    type: Date,
    default: Date.now,
  }
});

const SymModel = model("Symptoms", SymSchema);
module.exports= SymModel;