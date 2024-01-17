import { Request, Response } from 'express';
import Session from '../models/Session';
import {v4} from 'uuid';

const uuid = v4();

export const createSession = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const sessionId = v4();
    const sessionName = generateRandomName();
    const sixDigitCode = generateSixDigitCode();
    const createdDate = new Date();

    const session = new Session({
      sessionId,
      sessionName,
      sixDigitCode,
      username,
      createdDate,
    });

    await session.save();

    res.json({ sessionId, sessionName, sixDigitCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const joinSession = async (req: Request, res: Response) => {
  try {
    const { sixDigitCode } = req.body;

    const session = await Session.findOne({ sixDigitCode });
    console.log(session);

    if (session) {
      console.log(session);
      res.json(session);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generateRandomName = () => {
  // Implement your logic for generating a random name
  return 'RandomName';
};

const generateSixDigitCode = () => {
  // Implement your logic for generating a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000);
};