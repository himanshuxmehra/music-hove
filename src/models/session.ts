import { Session } from "./../types/session"
import { model, Schema } from "mongoose"

const sessionSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },
    
    createdBy: {
        type: String,
      },

    id: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

export default model<Session>("Session", sessionSchema)
