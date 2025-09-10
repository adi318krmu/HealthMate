const { Schema , model}= require('mongoose')

const DocSchema = new Schema({
    name :{
        type : String,
        required : true,
        maxlength : 50,

    },
    role:{
       type : String,
        required : true,
        maxlength : 50,
    }
    , 
      createdAt: {
    type: Date,
    default: Date.now,
  }
});

const DocModel= model("Doctors", DocSchema)
module.exports= DocModel;