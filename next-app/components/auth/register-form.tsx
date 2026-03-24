"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { setAuthorizationToken } from "@/lib/auth"

export default function RegisterForm() {
  const [form, setForm] = useState({ email: "", password: "", tenantSlug: "" })
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Registration failed")
      } else {
        const data = await res.json()
        if (data.token) {
          setAuthorizationToken(data.token)
        }
        setSuccess("Registration successful! You are now authenticated.")
        setForm({ email: "", password: "", tenantSlug: "" })
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
      <h2 className="text-lg font-semibold">Register</h2>
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
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        type="text"
        placeholder="Tenant Slug (e.g. acme)"
        value={form.tenantSlug}
        onChange={(e) => setForm((f) => ({ ...f, tenantSlug: e.target.value }))}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => router.push("/auth/login")}
      >
        Already registered? Login
      </Button>
      {error && <div className="text-sm text-destructive">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}
    </form>
  )
}
