'use client'

import { useState } from 'react'
import React from 'react'
import { Check, Minus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { type PermissionGroup } from './actions'
import { type Role } from '../roles/actions'

interface PermissionsMatrixProps {
  permissionGroups: PermissionGroup[]
  roles: Role[]
}

export function PermissionsMatrix({ permissionGroups, roles }: PermissionsMatrixProps) {
  const [search, setSearch] = useState('')

  const filtered = permissionGroups
    .map((group) => ({
      ...group,
      permissions: group.permissions.filter((p) =>
        p.label.toLowerCase().includes(search.toLowerCase()) ||
        p.key.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.permissions.length > 0)

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search permissions..." />

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Permission</TableHead>
              <TableHead className="min-w-[250px]">Description</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id} className="text-center min-w-[100px]">{role.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((group) => (
              <React.Fragment key={group.group}>
                <TableRow>
                  <TableCell colSpan={2 + roles.length} className="bg-muted/50 font-semibold text-xs uppercase tracking-wider">
                    {group.group}
                  </TableCell>
                </TableRow>
                {group.permissions.map((perm) => (
                  <TableRow key={perm.key}>
                    <TableCell className="font-medium">{perm.label}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{perm.description || '—'}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        {role.permission_keys.includes(perm.key) ? (
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={2 + roles.length} className="text-center text-muted-foreground py-8">
                  No permissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
