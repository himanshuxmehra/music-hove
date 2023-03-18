import { Session } from "./../types/session"
import { model, Schema } from "mongoose"

const sessionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    
    createdBy: {
        type: String,
        required: true,
      },

    id: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

export default model<Session>("Session", sessionSchema)
