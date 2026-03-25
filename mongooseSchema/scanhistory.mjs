import mongoose  from "mongoose";

const ScanHistorySchema = new mongoose.Schema({
    type:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    scannedInput:{
        type:mongoose.Schema.Types.String
    },
    aiscore:{
        type:mongoose.Schema.Types.Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserData"
    },
    risklevel:{
        type:mongoose.Schema.Types.String
    }

})

export const ScanHis = mongoose.model("ScanHistory",ScanHistorySchema)