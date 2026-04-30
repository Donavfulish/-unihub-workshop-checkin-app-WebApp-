'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import { Workshop } from '@/lib/types'
import { toast } from 'sonner'

interface WorkshopTableProps {
  workshops: Workshop[];
  onEdit?: (workshop: Workshop) => void;
  onDelete?: (workshopId: string) => void;
}

export function WorkshopTable({ workshops, onEdit, onDelete }: WorkshopTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = (workshopId: string) => {
    setDeleteTarget(null)
    onDelete?.(workshopId)
    toast.success('Workshop deleted successfully')
  }

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'Advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  }

  return (
    <>
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Instructor</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Registered</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center w-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workshops.length > 0 ? (
              workshops.map((workshop) => (
                <TableRow key={workshop.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{workshop.title}</p>
                      <p className="text-xs text-muted-foreground">{workshop.date}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{workshop.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm">{workshop.instructor}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-xs ${levelColors[workshop.level]}`}>
                      {workshop.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="text-sm font-medium">
                      {workshop.registered}/{workshop.capacity}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-semibold">${workshop.price}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit?.(workshop)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => setDeleteTarget(workshop.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No workshops found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTarget !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workshop? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
