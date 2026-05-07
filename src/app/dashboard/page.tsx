'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_PROFILE } from '@/lib/mock-auth'
import { loadStoredWorkshopFlows, type StoredWorkshopFlow } from '@/lib/my-workshops-store'

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}

export default function DashboardPage() {
  const [items, setItems] = useState<StoredWorkshopFlow[]>([])
  const [activeQrWorkshopId, setActiveQrWorkshopId] = useState<number | null>(null)

  useEffect(() => {
    setItems(loadStoredWorkshopFlows())
  }, [])

  const activeItem = items.find((item) => item.workshop.id === activeQrWorkshopId) ?? null

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName={MOCK_PROFILE.name} />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Workshops</h1>
          <p className="text-muted-foreground">
            Temporary student profile plus workshops captured from successful API registrations.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{MOCK_PROFILE.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{MOCK_PROFILE.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">University</p>
              <p className="font-medium">{MOCK_PROFILE.university}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Major</p>
              <p className="font-medium">{MOCK_PROFILE.major}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registered Workshops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.workshop.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{item.workshop.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Start: {formatDateTime(item.workshop.start_time)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      End: {formatDateTime(item.workshop.end_time)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setActiveQrWorkshopId((current) =>
                        current === item.workshop.id ? null : item.workshop.id,
                      )
                    }
                  >
                    View QR
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No registered workshops saved yet.
              </p>
            )}
          </CardContent>
        </Card>

        {activeItem && (
          <Card>
            <CardHeader>
              <CardTitle>QR for {activeItem.workshop.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4 font-mono text-sm break-all">
                {activeItem.qrCode || 'QR data is not available from the backend response yet.'}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
