import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DemoLead } from '../types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (lead: DemoLead) => void | Promise<void>
}

const DEFAULT_DEMO_EMAIL =
  (import.meta.env?.VITE_DEMO_EMAIL as string | undefined) ?? 'hello@nodestra.com'

const INITIAL: DemoLead = {
  name: '',
  workEmail: '',
  airport: '',
  teamSize: '',
  notes: '',
}

export function BookDemoDialog({ open, onOpenChange, onSubmit }: Props) {
  const [lead, setLead] = useState<DemoLead>(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function update<K extends keyof DemoLead>(key: K, value: DemoLead[K]) {
    setLead((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lead.name.trim() || !lead.workEmail.trim() || !lead.airport.trim()) {
      setError('Name, work email, and airport are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.workEmail)) {
      setError('That work email doesn\'t look right.')
      return
    }
    setSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(lead)
      } else {
        // Fallback: open a pre-filled mailto.
        const body = encodeURIComponent(
          `Name: ${lead.name}\nEmail: ${lead.workEmail}\nAirport: ${lead.airport}\nTeam size: ${lead.teamSize}\n\n${lead.notes}`,
        )
        const subject = encodeURIComponent(`Nodestra demo request — ${lead.airport}`)
        window.location.href = `mailto:${DEFAULT_DEMO_EMAIL}?subject=${subject}&body=${body}`
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      // Reset the form when closed.
      setLead(INITIAL)
      setError(null)
      setSuccess(false)
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Nodestra demo</DialogTitle>
          <DialogDescription>
            30 minutes, your own floor plan, your own flight board. We'll be in touch within one
            business day.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div style={{ padding: '8px 0', fontSize: 14 }}>
            <strong>Thanks — we've got it.</strong>
            <p style={{ marginTop: 8, color: 'var(--lp-muted, #6b7380)' }}>
              We'll reach out to <code>{lead.workEmail}</code> shortly to schedule.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="lp-demo-form" noValidate>
            <div className="lp-demo-field">
              <label htmlFor="demo-name" className="lp-demo-label">Your name</label>
              <input
                id="demo-name"
                className="lp-demo-input"
                value={lead.name}
                onChange={(e) => update('name', e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="lp-demo-field">
              <label htmlFor="demo-email" className="lp-demo-label">Work email</label>
              <input
                id="demo-email"
                type="email"
                className="lp-demo-input"
                value={lead.workEmail}
                onChange={(e) => update('workEmail', e.target.value)}
                required
              />
            </div>
            <div className="lp-demo-field">
              <label htmlFor="demo-airport" className="lp-demo-label">Airport</label>
              <input
                id="demo-airport"
                className="lp-demo-input"
                value={lead.airport}
                onChange={(e) => update('airport', e.target.value)}
                placeholder="IATA code or name"
                required
              />
            </div>
            <div className="lp-demo-field">
              <label htmlFor="demo-team" className="lp-demo-label">Team size</label>
              <select
                id="demo-team"
                className="lp-demo-select"
                value={lead.teamSize}
                onChange={(e) => update('teamSize', e.target.value)}
              >
                <option value="">Select…</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div className="lp-demo-field">
              <label htmlFor="demo-notes" className="lp-demo-label">Anything we should know?</label>
              <textarea
                id="demo-notes"
                className="lp-demo-textarea"
                value={lead.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
              />
            </div>

            {error && <div className="lp-demo-error" role="alert">{error}</div>}

            <div className="lp-demo-actions">
              <button
                type="button"
                className="lp-btn lp-btn-ghost"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </button>
              <button type="submit" className="lp-btn lp-btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Request demo'}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
