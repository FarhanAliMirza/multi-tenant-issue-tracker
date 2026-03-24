"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { setAuthorizationToken } from "@/lib/auth"

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Login failed")
      } else {
        if (data.token) {
          setAuthorizationToken(data.token)
        }
        setSuccess("Login successful! Redirecting...")
        // Optionally, redirect to issues page after login
        setTimeout(() => {
          window.location.href = "/issues"
        }, 1000)
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-lg bg-card p-6 shadow"
    >
      <h2 className="text-lg font-semibold">Login</h2>
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => router.push("/auth/register")}
      >
        Not registered? Register now
      </Button>
      <div className="rounded border bg-muted p-3 text-xs text-muted-foreground">
        <div className="mb-2">Demo login info (click to autofill):</div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs"
            onClick={() =>
              setForm({ email: "alice@acme.com", password: "password123" })
            }
          >
            alice@acme.com
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs"
            onClick={() =>
              setForm({ email: "bob@globex.com", password: "password123" })
            }
          >
            bob@globex.com
          </Button>
        </div>
        <div className="mt-2">Password: password123</div>
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}
    </form>
  )
}
