"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Issue {
  id: string
  title: string
  description: string
  createdAt: string
}

export default function IssueDetail({ id }: { id: string }) {
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchIssue() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`http://localhost:4000/api/issues/${id}`, {
          credentials: "include",
        })
        if (!res.ok) {
          setError("Not found or unauthorized")
          setIssue(null)
        } else {
          setIssue(await res.json())
        }
      } catch {
        setError("Network error")
        setIssue(null)
      } finally {
        setLoading(false)
      }
    }
    fetchIssue()
  }, [id])

  async function handleDelete() {
    if (!confirm("Delete this issue?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`http://localhost:4000/api/issues/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        setError("Failed to delete")
      } else {
        router.push("/issues")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    title: issue?.title || "",
    description: issue?.description || "",
    status: (issue as any)?.status || "OPEN",
    priority: (issue as any)?.priority || "MEDIUM",
  })

  useEffect(() => {
    if (issue) {
      setEditForm({
        title: issue.title,
        description: issue.description,
        status: (issue as any).status || "OPEN",
        priority: (issue as any).priority || "MEDIUM",
      })
    }
  }, [issue])

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`http://localhost:4000/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to update")
      } else {
        setEditMode(false)
        setIssue(await res.json())
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-destructive">{error}</div>
  if (!issue)
    return <div className="p-8 text-muted-foreground">Issue not found.</div>

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="rounded border bg-card p-6 shadow">
        {editMode ? (
          <form onSubmit={handleEdit} className="space-y-3">
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              value={editForm.description}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={editForm.status}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, status: e.target.value }))
              }
              required
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={editForm.priority}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, priority: e.target.value }))
              }
              required
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </form>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-semibold">{issue.title}</h2>
            <div className="mb-2 text-muted-foreground">
              {issue.description}
            </div>
            <div className="mb-2 text-xs text-muted-foreground">
              Created: {new Date(issue.createdAt).toLocaleString()}
            </div>
            <div className="mb-2 flex gap-4 text-xs">
              <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                Priority: {(issue as any).priority}
              </span>
              <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                Status: {(issue as any).status}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setEditMode(true)} disabled={loading}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
