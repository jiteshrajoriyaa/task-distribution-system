import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-2/5 h-3/5 text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Welcome to Task Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600 text-xl">
            A simple platform where Admins assign tasks and Agents complete them.
          </p>
          <Button asChild className="w-full text-xl">
            <a href="/signup">Get Started</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
