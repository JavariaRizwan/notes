const mongoose=require("mongoose");

const catgeorySchema= new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true},
        
        c_name:{
            type:String,
            required:true,
            trim:true,

        }
    },
    {timestamps: true}
)

module.exports=mongoose.model('Category', catgeorySchema);