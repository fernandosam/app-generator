'use client'

import {
  type ColumnDef,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Frame, FrameFooter } from '@/components/ui/frame'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/** Official coss p-table-4 composition, without domain-specific flight fixtures. */
export const dataTableFeatures = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type DataTableColumn<TData> = ColumnDef<typeof dataTableFeatures, TData>

export interface DataTableProps<TData> {
  data: TData[]
  columns: DataTableColumn<TData>[]
  pageSize?: number
  emptyMessage?: string
  getRowId?: (item: TData) => string
}

export function normalizePageSize(value: number): number {
  return Number.isFinite(value) && Number.isInteger(value) && value > 0 ? value : 10
}

export function DataTable<TData>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = 'Nenhum resultado encontrado.',
  getRowId,
}: DataTableProps<TData>) {
  const table = useTable(
    {
      columns,
      data,
      features: dataTableFeatures,
      getRowId,
      enableSortingRemoval: false,
      initialState: { pagination: { pageIndex: 0, pageSize: normalizePageSize(pageSize) } },
    },
    (state) => ({
      pagination: state.pagination,
      rowSelection: state.rowSelection,
      sorting: state.sorting,
    }),
  )

  return (
    <Frame className="w-full">
      <Table variant="card">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const sort = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sort === 'asc' ? (
                          <ChevronUpIcon aria-hidden="true" className="size-4 shrink-0" />
                        ) : sort === 'desc' ? (
                          <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0" />
                        ) : null}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <FrameFooter className="flex flex-wrap items-center justify-between gap-3 p-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {table.getRowCount()} resultado(s) · Página{' '}
          {table.getPageCount() === 0 ? 0 : table.state.pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </p>
        <Pagination className="w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                render={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  />
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                render={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  />
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </FrameFooter>
    </Frame>
  )
}
