'use client'

import { Navbar } from '@/components/navbar'
import { RouteGuard } from '@/components/route-guard'
import { AdminStatsCard } from '@/components/admin-stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react'
import { mockWorkshops, mockRegistrations } from '@/lib/mock-data'

const chartData = [
  {
    month: 'Jan',
    registrations: 400,
    revenue: 1000,
  },
  {
    month: 'Feb',
    registrations: 520,
    revenue: 1500,
  },
  {
    month: 'Mar',
    registrations: 680,
    revenue: 2100,
  },
  {
    month: 'Apr',
    registrations: 850,
    revenue: 2800,
  },
  {
    month: 'May',
    registrations: 950,
    revenue: 3200,
  },
]

export default function AdminDashboard() {
  const totalRevenue = mockWorkshops.reduce((sum, w) => sum + w.price * w.registered, 0)
  const totalRegistrations = mockRegistrations.length
  const activeWorkshops = mockWorkshops.filter((w) => w.registered > 0).length

  return (
    <RouteGuard roles={['admin']}>
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your workshop platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatsCard
            title="Total Registrations"
            value={totalRegistrations}
            icon={Users}
            description={`${totalRegistrations} active registrations`}
            trend={{ value: 12, isPositive: true }}
          />
          <AdminStatsCard
            title="Active Workshops"
            value={activeWorkshops}
            icon={BookOpen}
            description={`${mockWorkshops.length} total workshops`}
            trend={{ value: 5, isPositive: true }}
          />
          <AdminStatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="From all workshops"
            trend={{ value: 8, isPositive: true }}
          />
          <AdminStatsCard
            title="Avg. Registration Rate"
            value={`${Math.round((mockWorkshops.reduce((sum, w) => sum + w.registered, 0) / (mockWorkshops.length * mockWorkshops[0].capacity)) * 100)}%`}
            icon={TrendingUp}
            description="Workshop capacity filled"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Registrations & Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius)',
                      }}
                      labelStyle={{ color: 'var(--color-foreground)' }}
                    />
                    <Legend />
                    <Bar dataKey="registrations" fill="var(--color-primary)" />
                    <Bar dataKey="revenue" fill="var(--color-secondary)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Avg. Per Workshop</span>
                  <span className="font-bold">
                    {Math.round(totalRegistrations / mockWorkshops.length)} registrations
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Avg. Price</span>
                  <span className="font-bold">
                    ${(mockWorkshops.reduce((sum, w) => sum + w.price, 0) / mockWorkshops.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sold Out</span>
                  <span className="font-bold">
                    {mockWorkshops.filter((w) => w.registered === w.capacity).length} workshops
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Workshops */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWorkshops.slice(0, 3).map((workshop) => (
                <Card key={workshop.id}>
                  <CardContent className="pt-6 space-y-2">
                    <p className="font-semibold">{workshop.title}</p>
                    <p className="text-sm text-muted-foreground">{workshop.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {workshop.registered}/{workshop.capacity} registered
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </RouteGuard>
  )
}
