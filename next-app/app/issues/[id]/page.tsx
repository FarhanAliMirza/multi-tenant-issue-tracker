'use client'
import IssueDetail from "@/components/issues/issue-detail"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"

export default async function IssueDetailPage() {
  const params = useParams()
  if (!params.id){
    return notFound()
  }
  else {
    console.log(params.id)
    const id = params.id.toString()
    return <IssueDetail id={id} />
  }
}
