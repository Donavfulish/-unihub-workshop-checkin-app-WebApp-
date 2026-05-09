'use client'

import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { WorkshopResponse } from '@/types'

interface WorkshopCardProps {
  workshop: WorkshopResponse;
}

function formatDateTime(value?: string | Date | null) {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-5">
        <p className="text-sm text-muted-foreground mb-2">Workshop #{workshop.id}</p>
        <h3 className="font-semibold text-lg mb-3 text-balance">{workshop.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {workshop.description || 'No description available.'}
        </p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formatDateTime(workshop.start_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              {workshop.remaining_slots ?? 'N/A'} / {workshop.total_slots ?? 'N/A'} slots remaining
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="text-sm font-semibold">Fee: {workshop.fee ?? 'N/A'}</div>
        <Link href={`/workshops/${workshop.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
