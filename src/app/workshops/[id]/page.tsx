'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { RegistrationForm } from '@/components/registration-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Users, Clock, MapPin, BookOpen, Award, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { mockWorkshops } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

interface WorkshopDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const { id } = await params
  const workshop = mockWorkshops.find((w) => w.id === id)

  if (!workshop) {
    notFound()
  }

  const seatsAvailable = workshop.capacity - workshop.registered
  const isAlmostFull = seatsAvailable <= 5

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Student" />

      <main className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          ← Back to Workshops
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Workshop Image */}
            <div className="relative h-80 rounded-lg overflow-hidden mb-8 bg-muted">
              <Image
                src={workshop.image}
                alt={workshop.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Badges */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{workshop.category}</Badge>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  {workshop.level}
                </Badge>
                <Badge variant="outline">${workshop.price}</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-balance">{workshop.title}</h1>
              <p className="text-lg text-muted-foreground">
                Taught by <span className="font-semibold text-foreground">{workshop.instructor}</span>
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="font-semibold text-sm">{workshop.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-sm">{workshop.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-semibold text-sm">{workshop.registered}/{workshop.capacity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-semibold text-sm">{workshop.level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Availability Alert */}
            {isAlmostFull && (
              <Alert className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  Only {seatsAvailable} seats remaining! Register now to secure your spot.
                </AlertDescription>
              </Alert>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Workshop</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {workshop.description}
              </p>
            </div>

            {/* AI Summary */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  AI Generated Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{workshop.aiSummary}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Syllabus Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {workshop.syllabus.split(' | ').map((topic, i) => (
                      <Badge key={i} variant="outline" className="bg-background">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Skills You&apos;ll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {workshop.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Register for Workshop</CardTitle>
              </CardHeader>
              <CardContent>
                {seatsAvailable > 0 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-4" size="lg">
                        Register Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Register for {workshop.title}</DialogTitle>
                        <DialogDescription>
                          Fill in your details to complete the registration.
                        </DialogDescription>
                      </DialogHeader>
                      <RegistrationForm
                        workshopTitle={workshop.title}
                        onSuccess={() => {
                          // Dialog will close automatically via form submission
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button className="w-full mb-4" disabled size="lg">
                    Sold Out
                  </Button>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold">${workshop.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Seats:</span>
                    <span className="font-semibold">{seatsAvailable}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Registered:</span>
                    <span className="font-semibold">{workshop.registered}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
