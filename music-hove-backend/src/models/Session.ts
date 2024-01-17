import mongoose, { Schema } from 'mongoose';

interface Session {
  sessionId: string;
  sessionName: string;
  sixDigitCode: number;
  username: string;
  createdDate: Date;
}

const SessionSchema = new Schema<Session>({
  sessionId: { type: String, required: true, unique: true },
  sessionName: { type: String, required: true },
  sixDigitCode: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  createdDate: { type: Date, required: true },
});

const Session = mongoose.model<Session>('Session', SessionSchema);

export default Session;
