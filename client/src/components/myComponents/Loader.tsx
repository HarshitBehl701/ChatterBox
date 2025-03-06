import { Loader2 } from "lucide-react"

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  )
}

export default Loader