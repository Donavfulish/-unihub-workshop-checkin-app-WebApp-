'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookmarkIcon, Clock, MapPin, UserCheck } from 'lucide-react'
import { mockWorkshops, mockRegistrations, mockStudents } from '@/lib/mock-data'

export default function DashboardPage() {
  const currentStudent = mockStudents[0] // In a real app, this would come from auth
  const studentRegistrations = mockRegistrations.filter((r) => r.studentId === currentStudent.id)
  
  const upcomingRegistrations = studentRegistrations.filter((r) => r.status === 'active')
  const completedRegistrations = studentRegistrations.filter((r) => r.status === 'completed')

  const upcomingWorkshops = upcomingRegistrations
    .map((reg) => mockWorkshops.find((w) => w.id === reg.workshopId))
    .filter(Boolean) as typeof mockWorkshops

  const completedWorkshops = completedRegistrations
    .map((reg) => mockWorkshops.find((w) => w.id === reg.workshopId))
    .filter(Boolean) as typeof mockWorkshops

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName={currentStudent.name} />

      <main className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentStudent.name}! Here&apos;s an overview of your workshop journey.
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-semibold">{currentStudent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-sm">{currentStudent.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">University</p>
                <p className="font-semibold">{currentStudent.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Major</p>
                <p className="font-semibold">{currentStudent.major}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="text-3xl font-bold">{studentRegistrations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-3xl font-bold">{upcomingWorkshops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookmarkIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">{completedWorkshops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshops Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingWorkshops.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedWorkshops.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingWorkshops.length > 0 ? (
              <div className="space-y-4">
                {upcomingWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4 md:gap-6">
                        {/* Image */}
                        <div className="hidden sm:block relative h-24 w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={workshop.image}
                            alt={workshop.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{workshop.title}</h3>
                              <p className="text-sm text-muted-foreground">by {workshop.instructor}</p>
                            </div>
                            <Badge className="ml-2">{workshop.category}</Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{workshop.date} • {workshop.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{workshop.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex flex-col gap-2">
                          <Link href={`/workshops/${workshop.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            View QR Code
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t registered for any upcoming workshops yet.
                  </p>
                  <Link href="/">
                    <Button>Explore Workshops</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            {completedWorkshops.length > 0 ? (
              <div className="space-y-4">
                {completedWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-md transition-shadow opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex gap-4 md:gap-6">
                        {/* Image */}
                        <div className="hidden sm:block relative h-24 w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={workshop.image}
                            alt={workshop.title}
                            fill
                            className="object-cover grayscale"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{workshop.title}</h3>
                              <p className="text-sm text-muted-foreground">by {workshop.instructor}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2">Completed</Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{workshop.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{workshop.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Download Certificate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t completed any workshops yet.
                  </p>
                  <Link href="/">
                    <Button>Browse Workshops</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
