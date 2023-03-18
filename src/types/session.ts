import { Document } from "mongoose"

export interface Session extends Document {
  name: string
  id: string
  description: string
  createdBy: string
  status: boolean
}