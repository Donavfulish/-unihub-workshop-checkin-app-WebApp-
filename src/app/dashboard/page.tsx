'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useMyWorkshops } from '@/components/my-workshops-provider'
import { Navbar } from '@/components/navbar'
import { RouteGuard } from '@/components/route-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { items } = useMyWorkshops()
  const [activeQrWorkshopId, setActiveQrWorkshopId] = useState<number | null>(null)

  const activeItem = items.find((item) => item.workshop.id === activeQrWorkshopId) ?? null

  const displayName =
    user?.full_name?.trim() ||
    user?.username?.trim() ||
    user?.email?.split('@')[0] ||
    'User'

  return (
    <RouteGuard roles={['student', 'staff']}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Workshops</h1>
            <p className="text-muted-foreground">
              Thông tin tài khoản và workshop bạn đã đăng ký trong phiên hiện tại.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Tên</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vai trò</p>
                <p className="font-medium capitalize">{user?.role ?? '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Workshop đã đăng ký</CardTitle>
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
                        Bắt đầu: {formatDateTime(item.workshop.start_time)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kết thúc: {formatDateTime(item.workshop.end_time)}
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
                  Chưa có workshop nào trong phiên này. Hãy đăng ký từ trang chi tiết workshop.
                </p>
              )}
            </CardContent>
          </Card>

          {activeItem && (
            <Card>
              <CardHeader>
                <CardTitle>QR for {activeItem.workshop.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {activeItem.qrCode ? (
                  <>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <QRCodeCanvas
                        value={activeItem.qrCode}
                        size={200}
                        level="H"
                        includeMargin
                      />
                    </div>
                  </>
                ) : (
                  <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    QR data is not available from the backend response yet.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
