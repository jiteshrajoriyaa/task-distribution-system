import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/lib/config"
import { useNavigate } from "react-router-dom"

interface Task {
  FirstName: string
  Phone: number
  Notes: string
}

interface DistributedAgent {
  agentId: string,
  name: string,
  email: string,
  fullNumber: string,
  items: Task[]
}

export function AssignTask() {
  const [file, setFile] = useState<File | null>(null)
  const [distributed, setDistributed] = useState<DistributedAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      setError("")
      const res = await axios.post(`${BACKEND_URL}/assign-task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setDistributed(res.data.distributed)
      localStorage.setItem("distributedLength", res.data.distributed?.length.toString());

    } catch (err: any) {
      setError(err.response?.data?.msg || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Upload Form */}
      <Card className="max-w-md mx-auto mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Upload Task File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload & Distribute"}
          </Button>
          <br />
          {error === "Add at least 1 agent" && 
          <Button onClick={()=>{
            navigate('/add-agents')
          }} disabled={loading}>
            Add agents
          </Button>
        }
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* Display Distributed Tasks */}
      {distributed.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {distributed.map((agent, idx) => (
            <Card key={agent.agentId} className="shadow">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>{agent.fullNumber}</CardDescription>
                <CardDescription>{agent.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {agent.items.length > 0 ? (
                  agent.items.map((task, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded p-2 bg-white hover:shadow"
                    >
                      <p><strong>Name:</strong> {task.FirstName}</p>
                      <p><strong>Phone:</strong> {task.Phone}</p>
                      <p><strong>Notes:</strong> {task.Notes}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No tasks assigned</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
