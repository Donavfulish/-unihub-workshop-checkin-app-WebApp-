'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { WorkshopCard } from '@/components/workshop-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp } from 'lucide-react'
import { mockWorkshops } from '@/lib/mock-data'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(mockWorkshops.map((w) => w.category)))

  const filteredWorkshops = mockWorkshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || workshop.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Student" />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-transparent to-transparent pt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">2000+ Students Learning</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-balance mb-4">
              Discover Your Next Workshop
            </h1>
            <p className="text-lg text-muted-foreground text-balance mb-8">
              Join expert-led workshops and accelerate your learning journey. From web development to data science, find the perfect course for you.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search workshops, instructors, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-foreground">Categories:</span>
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory ? `${selectedCategory} Workshops` : 'All Workshops'}
            </h2>
            <p className="text-muted-foreground">
              {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No workshops found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-6">
            Pick a workshop, register in minutes, and start your learning journey today.
          </p>
          <Button size="lg">Browse All Workshops</Button>
        </div>
      </section>
    </div>
  )
}
