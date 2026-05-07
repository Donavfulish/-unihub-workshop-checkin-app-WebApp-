'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { RouteGuard } from '@/components/route-guard'
import { WorkshopTable } from '@/components/workshop-table'
import { WorkshopFormModal } from '@/components/workshop-form-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { mockWorkshops } from '@/lib/mock-data'
import { Workshop } from '@/lib/types'

export default function WorkshopManagementPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(mockWorkshops.map((w) => w.category)))]

  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleEdit = (workshop: Workshop) => {
    console.log('Edit workshop:', workshop)
    // In a real app, this would open an edit modal with the workshop data
  }

  const handleDelete = (workshopId: string) => {
    setWorkshops(workshops.filter((w) => w.id !== workshopId))
  }

  return (
    <RouteGuard roles={['admin']}>
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workshop Management</h1>
          <p className="text-muted-foreground">
            Manage all workshops on the platform. Create, edit, or delete workshops.
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add New Button */}
              <WorkshopFormModal onSuccess={() => {
                // Refresh workshops list
                setWorkshops([...workshops])
              }} />
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Workshops</p>
                <p className="text-3xl font-bold">{workshops.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-3xl font-bold">{filteredWorkshops.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-3xl font-bold">
                  {workshops.reduce((sum, w) => sum + w.registered, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workshops Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Workshops</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <WorkshopTable
              workshops={filteredWorkshops}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </main>
    </div>
    </RouteGuard>
  )
}
