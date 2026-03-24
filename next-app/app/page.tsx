import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-6 rounded-xl bg-card p-8 text-sm leading-loose shadow">
        <div>
          <h1 className="mb-2 text-2xl font-medium">
            Multi-Tenant Issue Tracker
          </h1>
          <p className="mb-2">
            A secure issue tracker for multiple tenants and users. Register or
            log in to get started.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/auth/register">
              <Button variant="outline">Register</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
