import { Response, Request,RequestHandler } from "express"
import { Session as SessionType } from "./../../types/session"
import Session from "../../models/session"
import { v4 as uuidv4 } from 'uuid';

const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions: SessionType[] = await Session.find()
    res.status(200).json({ sessions })
  } catch (error) {
    throw error
  }
}

const getSessionDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findOne(req.body.id)
    res.status(200).json({ session })
  } catch (error) {
    throw error
  }
}

const createSession:RequestHandler = async (req,res): Promise<void> => {
  try {
    const body = req.body
    console.log(body)
    var name =  body.name
    var description = (body as {description:string}).description
    var status = body.status
    var id = body.id
    var createdBy = body.createdBy
    const session: SessionType = new Session({
      name: name,
      description: description,
      status: status,
      createdBy: createdBy,
      id: uuidv4()
    })

    const newSession: SessionType = await session.save()
    const allSessions: SessionType[] = await Session.find()

    res
      .status(201)
      .json({ message: "Session added", session: newSession, sessions: allSessions })
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req
    const updateSession: SessionType | null = await Session.findByIdAndUpdate(
      { _id: id },
      body
    )
    const allSessions: SessionType[] = await Session.find()
    res.status(200).json({
      message: "Session updated",
      session: updateSession,
      sessions: allSessions,
    })
  } catch (error) {
    throw error
  }
}

const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedSession: SessionType | null = await Session.findByIdAndRemove(
      req.params.id
    )
    const allSessions: SessionType[] = await Session.find()
    res.status(200).json({
      message: "Session deleted",
      Session: deletedSession,
      Sessions: allSessions,
    })
  } catch (error) {
    throw error
  }
}

export { getSessions, createSession, updateSession, deleteSession, getSessionDetail };