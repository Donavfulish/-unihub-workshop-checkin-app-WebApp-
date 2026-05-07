'use client'

import { useEffect, useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_PROFILE, getMockAccessToken } from '@/lib/mock-auth'
import { PaymentService } from '@/services/modules/payment/payment.service'
import { RegistrationService } from '@/services/modules/registration/registration.service'
import type { PaymentDTO, RegistrationDTO } from '@/types'

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<RegistrationDTO[]>([])
  const [payments, setPayments] = useState<PaymentDTO[]>([])
  const [activeQrWorkshopId, setActiveQrWorkshopId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)

        const token = getMockAccessToken()
        const [registrationsResponse, paymentsResponse] = await Promise.all([
          RegistrationService.listMine({ token }),
          PaymentService.listMine({ token }),
        ])

        if (registrationsResponse.error) {
          throw new Error(registrationsResponse.error.message)
        }

        if (paymentsResponse.error) {
          throw new Error(paymentsResponse.error.message)
        }

        setRegistrations(registrationsResponse.data?.items ?? [])
        setPayments(paymentsResponse.data?.items ?? [])
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load workshop state.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [])

  const items = useMemo(
    () =>
      registrations
        .filter((item) => item.workshop)
        .map((registration) => {
          const payment = payments.find(
            (item) => item.registration_id === registration.id,
          ) ?? null

          return {
            registration,
            payment,
            workshop: registration.workshop!,
            status:
              payment || registration.status === 'Paid'
                ? 'Paid'
                : 'Confirmed',
            qrCode:
              payment?.registration?.qr_code_hash ??
              registration.qr_code_hash ??
              null,
          }
        }),
    [payments, registrations],
  )

  const activeItem = items.find((item) => item.workshop.id === activeQrWorkshopId) ?? null

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName={MOCK_PROFILE.name} />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Workshops</h1>
          <p className="text-muted-foreground">
            Real registration and payment state loaded from the backend.
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
            {isLoading ? (
              <p className="text-muted-foreground">Loading workshops...</p>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.registration.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{item.workshop.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {item.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start: {formatDateTime(item.workshop.start_time)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      End: {formatDateTime(item.workshop.end_time)}
                    </p>
                  </div>

                  {item.status === 'Paid' ? (
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
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No workshops found for this account.
              </p>
            )}
          </CardContent>
        </Card>

        {activeItem?.qrCode ? (
          <Card>
            <CardHeader>
              <CardTitle>QR for {activeItem.workshop.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <QRCodeCanvas
                  value={activeItem.qrCode}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  )
}
