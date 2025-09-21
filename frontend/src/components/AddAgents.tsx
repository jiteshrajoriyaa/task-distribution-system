import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"
import { handleAxiosError } from "@/lib/handleAxiosError"
import { useNavigate } from "react-router-dom"

interface Agent {
    name: string
    email: string
    countryCode: string
    phone: string
}

export function AddAgents() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()


    const addAgent = async () => {
        const newAgent: Agent = {
            name,
            email,
            countryCode,
            phone
        }
        if (!email || !phone || !countryCode || !name) {
            setError("All field are required")
            return
        }
        try {
            await axios.post(`${BACKEND_URL}/add-agents`,
                {
                    name,
                    email,
                    countryCode,
                    phone
                }, {
                headers: {
                    token: localStorage.getItem("token")
                },
            })
            setAgents([...agents, newAgent])
            setName("")
            setEmail("")
            setPhone("")
            setError("")
            alert('Agent added successfully')
        } catch (err) {
            setError(handleAxiosError(err))
        }
    }
    const agentLength = localStorage.getItem("distributedLength");

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Add Agent Form */}
            <Card className="max-w-md mx-auto mb-8 shadow-md">
                <CardHeader>
                    <CardTitle>No of agents: {agentLength ? <span>{agentLength}</span>: "0"}: At least 1</CardTitle>
                </CardHeader>
                <CardHeader>
                    <CardTitle>Add New Agent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Country code without +"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                    />
                    <Input
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <Button className="w-full" onClick={addAgent}>
                        Add Agent
                    </Button>
                    <Button className="w-full" onClick={()=>{
                        navigate('/assign-task')
                    }}>
                        Assign Task with exisiting agents
                    </Button>
                    <p className="text-red-400 font-bold">{error}</p>
                    <p>Please keep in mind:  <br />
                        1. Enter a valid email id (at least <span className="underline">@gmail.com</span> at the end) <br />
                        2. Name box can't be empty <br />
                        3. Add country code without '+' <br />
                        4. Phone number must start with 0 and contain 10 digits only
                    </p>
                </CardContent>
            </Card>


        </div>
    )
}
