import axios from "axios"

export function handleAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const status = err.response.status
      switch (status) {
        case 400:
          return "Please Enter valid data"
        case 401:
          return "Unauthorized – Please login again."
        case 404:
          return "Not Found – Endpoint doesn't exist."
        case 409:
          return "Conflict – Record already exists."
        case 422:
          return "Unprocessable Entity – Invalid data format."
        case 500:
          return "File format is not correct"
        default:
          return `Error ${status}: ${err.response.data?.message || "Something went wrong."}`
      }
    } else if (err.request) {
      return "No response from server. Please try again later."
    } else {
      return "Axios Error: " + err.message
    }
  }
  return "Unknown Error"
}
