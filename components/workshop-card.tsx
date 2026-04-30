'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Users, Clock, MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Workshop } from '@/lib/types'

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const seatsAvailable = workshop.capacity - workshop.registered;
  const seatsPercentage = (workshop.registered / workshop.capacity) * 100;

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'Advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Workshop Image */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <Image
          src={workshop.image}
          alt={workshop.title}
          fill
          className="object-cover hover:scale-105 transition-transform"
        />
      </div>

      <CardContent className="flex-1 pt-4">
        {/* Category and Level Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">{workshop.category}</Badge>
          <Badge className={`text-xs ${levelColors[workshop.level]}`}>
            {workshop.level}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 text-balance">
          {workshop.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground mb-3">
          by <span className="font-medium text-foreground">{workshop.instructor}</span>
        </p>

        {/* Workshop Details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
            <span>{workshop.date} • {workshop.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span>{workshop.location}</span>
          </div>
        </div>

        {/* Seats Available Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Seats Available</span>
            <span className="text-sm text-muted-foreground">
              {seatsAvailable}/{workshop.capacity}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${seatsPercentage}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {workshop.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold">${workshop.price}</span>
        </div>
        <Link href={`/workshops/${workshop.id}`}>
          <Button size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
