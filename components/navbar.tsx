'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserDropdown } from '@/components/user-dropdown'

interface NavbarProps {
  userRole?: 'student' | 'admin';
  userName?: string;
}

export function Navbar({ userRole = 'student', userName = 'Student' }: NavbarProps) {
  const isAdmin = userRole === 'admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            UH
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">UniHub</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {isAdmin ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/admin/workshops">
                <Button variant="ghost" size="sm">Workshops</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm">Workshops</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">My Workshops</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserDropdown userName={userName} userRole={userRole} />
        </div>
      </div>
    </nav>
  )
}
