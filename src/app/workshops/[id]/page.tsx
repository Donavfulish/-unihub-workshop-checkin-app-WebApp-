import { notFound } from 'next/navigation'
import { WorkshopDetailClient } from '@/components/workshop-detail-client'

interface WorkshopDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const { id } = await params
  const workshopId = Number(id)

  if (Number.isNaN(workshopId)) {
    notFound()
  }

  return <WorkshopDetailClient workshopId={workshopId} />
}
