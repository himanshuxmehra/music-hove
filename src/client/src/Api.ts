import axios, { AxiosResponse } from "axios"

const baseUrl: string = "http://localhost:4000"

export const getSessions = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const sessions: AxiosResponse<ApiDataType> = await axios.get(
      baseUrl + "/sessions"
    )
    return sessions
  } catch (error) {
    throw error
  }
}

export const getSessionDetail = async (room:any): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const sessions: AxiosResponse<ApiDataType> = await axios.get(
      baseUrl + "/getSessionDetail",{
        params:{
          id:room
        },
        timeout: 1000 * 5 //timeout after 5sec
      }
      
    )
    return sessions
  } catch (error) {
    throw error
  }
}