interface Session{
    name: string
    description: string
    createdBy: string
    id: string
    status: boolean
}

interface SessionProps {
    session: Session
}

type ApiDataType = {
    message: string
    status: string
    sessions: Session[]
    session?: Session
  }
