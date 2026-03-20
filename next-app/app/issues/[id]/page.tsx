import IssueDetail from "@/components/issues/issue-detail"
import { notFound } from "next/navigation"

export default async function IssueDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <IssueDetail id={params.id} />
}
