"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearAuthorizationToken, getAuthorizationToken } from "@/lib/auth"

interface Issue {
  id: string
  title: string
  description: string
  createdAt: string
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    setError("")
    try {
      const authorization = getAuthorizationToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: authorization ? { Authorization: authorization } : undefined,
        }
      )
      if (!res.ok) {
        setError("Logout failed")
      } else {
        clearAuthorizationToken()
        router.push("/auth/login")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true)
      setError("")
      try {
        const authorization = getAuthorizationToken()
        if (!authorization) {
          setError("Not authenticated")
          setIssues([])
          router.push("/auth/login")
          return
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`,
          {
            headers: { Authorization: authorization },
          }
        )
        if (!res.ok) {
          setError("Failed to fetch issues")
          setIssues([])
        } else {
          setIssues(await res.json())
        }
      } catch {
        setError("Network error")
        setIssues([])
      } finally {
        setLoading(false)
      }
    }
    fetchIssues()
  }, [router])

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Issues</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowForm((f) => !f)}
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? "Cancel" : "New Issue"}
          </Button>
          <Button variant="outline" onClick={handleLogout} disabled={loading}>
            Logout
          </Button>
        </div>
      </div>
      {showForm && (
        <NewIssueForm onCreated={(issue) => setIssues((i) => [issue, ...i])} />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : issues.length === 0 ? (
        <div className="text-muted-foreground">No issues found.</div>
      ) : (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className="rounded border bg-card p-4 transition hover:shadow"
            >
              <a href={`/issues/${issue.id}`} className="block">
                <div className="mb-1 text-lg font-medium">{issue.title}</div>
                <div className="mb-1 text-sm text-muted-foreground">
                  {issue.description}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{new Date(issue.createdAt).toLocaleString()}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NewIssueForm({ onCreated }: { onCreated: (issue: Issue) => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const authorization = getAuthorizationToken()
      if (!authorization) {
        setError("Not authenticated")
        return
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create issue")
      } else {
        const issue = await res.json()
        onCreated(issue)
        setForm({ title: "", description: "", priority: "MEDIUM" })
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-3 rounded border bg-card p-4"
    >
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
      />
      <textarea
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
        required
      />
      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={form.priority}
        onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
        required
      >
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Issue"}
      </Button>
      {error && <div className="text-sm text-destructive">{error}</div>}
    </form>
  )
}
