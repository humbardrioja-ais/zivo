'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FormSection } from '@/components/shared/form-section'
import { saveOrganization, type OrganizationProfile } from './actions'

type FormData = {
  name: string
  legalName: string
  description: string
  primaryColor: string
  secondaryColor: string
  email: string
  phone: string
  website: string
  country: string
  timezone: string
  language: string
  currency: string
  dateFormat: string
  timeFormat: string
  address: string
}

function toFormData(org: OrganizationProfile): FormData {
  return {
    name: org.name ?? '',
    legalName: org.legal_name ?? '',
    description: org.description ?? '',
    primaryColor: org.primary_color ?? '#000000',
    secondaryColor: org.secondary_color ?? '#6b7280',
    email: org.email ?? '',
    phone: org.phone ?? '',
    website: org.website ?? '',
    country: org.country ?? '',
    timezone: org.timezone ?? '',
    language: org.language ?? '',
    currency: org.currency ?? '',
    dateFormat: org.date_format ?? '',
    timeFormat: org.time_format ?? '',
    address: org.address ?? '',
  }
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
]

const currencies = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
  { value: 'BRL', label: 'BRL — Brazilian Real' },
]

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
]

const timeFormats = [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' },
]

interface OrganizationFormProps {
  organization: OrganizationProfile
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const router = useRouter()
  const initial = toFormData(organization)
  const [form, setForm] = useState<FormData>(initial)
  const [saved, setSaved] = useState<FormData>(initial)
  const [saving, setSaving] = useState(false)

  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved)

  const update = useCallback(
    (field: keyof FormData, value: string | null) => {
      setForm((prev) => ({ ...prev, [field]: value ?? '' }))
    },
    [],
  )

  function handleCancel() {
    setForm(saved)
  }

  async function handleSave() {
    setSaving(true)
    const result = await saveOrganization(organization.id, {
      name: form.name,
      legal_name: form.legalName || null,
      description: form.description || null,
      primary_color: form.primaryColor || null,
      secondary_color: form.secondaryColor || null,
      email: form.email || null,
      phone: form.phone || null,
      website: form.website || null,
      country: form.country || null,
      timezone: form.timezone || null,
      language: form.language || null,
      currency: form.currency || null,
      date_format: form.dateFormat || null,
      time_format: form.timeFormat || null,
      address: form.address || null,
    })
    setSaving(false)

    if (result.error) return

    setSaved(form)
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormSection title="General" description="Basic organization information.">
          <div className="space-y-2">
            <Label htmlFor="name">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Acme Corporation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal Name</Label>
            <Input
              id="legalName"
              value={form.legalName}
              onChange={(e) => update('legalName', e.target.value)}
              placeholder="Acme Corporation LLC"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A brief description of your organization"
              rows={3}
            />
          </div>
        </FormSection>

        <FormSection title="Branding" description="Visual identity and brand assets.">
          <div className="space-y-2 sm:col-span-2">
            <Label>Logo</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Upload logo</span>
                <span className="text-xs">PNG, JPG, or SVG up to 2MB</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="primaryColor"
                value={form.primaryColor}
                onChange={(e) => update('primaryColor', e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => update('primaryColor', e.target.value)}
                className="flex-1 font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="secondaryColor"
                value={form.secondaryColor}
                onChange={(e) => update('secondaryColor', e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
              />
              <Input
                value={form.secondaryColor}
                onChange={(e) => update('secondaryColor', e.target.value)}
                className="flex-1 font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Contact" description="Primary contact information.">
          <div className="space-y-2">
            <Label htmlFor="email">Primary Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="contact@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Primary Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://www.company.com"
            />
          </div>
        </FormSection>

        <FormSection title="Localization" description="Regional and formatting preferences.">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              placeholder="United States"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => update('timezone', v)}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={form.language} onValueChange={(v) => update('language', v)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((cur) => (
                  <SelectItem key={cur.value} value={cur.value}>
                    {cur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select value={form.dateFormat} onValueChange={(v) => update('dateFormat', v)}>
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map((df) => (
                  <SelectItem key={df.value} value={df.value}>
                    {df.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeFormat">Time Format</Label>
            <Select value={form.timeFormat} onValueChange={(v) => update('timeFormat', v)}>
              <SelectTrigger id="timeFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {timeFormats.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormSection>

        <FormSection title="Address" description="Physical location of the organization.">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Mailing Address</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder={"123 Main Street\nSuite 100\nNew York, NY 10001"}
              rows={4}
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleCancel} disabled={!hasChanges || saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
