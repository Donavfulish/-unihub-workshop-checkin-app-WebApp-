'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { WorkshopCard } from '@/components/workshop-card'
import { Card, CardContent } from '@/components/ui/card'
import { getMockAccessToken } from '@/lib/mock-auth'
import { WorkshopService } from '@/services/modules/workshop/workshop.service'
import type { WorkshopResponse } from '@/types'

export default function Home() {
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWorkshops() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await WorkshopService.list({
          token: getMockAccessToken(),
        })

        if (response.error) {
          throw new Error(response.error.message)
        }

        setWorkshops(response.data?.workshops ?? [])
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load workshops.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadWorkshops()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Mock Student" />

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Workshop List</h1>
            <p className="text-muted-foreground">
              Showing workshops fetched from the backend API.
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="pt-6 text-muted-foreground">
                Loading workshops...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="pt-6 text-destructive">{error}</CardContent>
            </Card>
          ) : workshops.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-muted-foreground">
                No workshops available.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
