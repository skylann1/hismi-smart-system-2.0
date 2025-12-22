// components/CandidateForm.tsx
'use client'

import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
}

export default function CandidateForm({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    no: '',
    name: '',
    vision: '',
    mission: '',
    photo: '',
  })

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      id: Date.now().toString(),
      no: Number(form.no),
      name: form.name,
      vision: form.vision,
      mission: form.mission,
      votes: 0,
      photo: form.photo || '/placeholder.jpg',
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Tambah Kandidat
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Nomor Urut"
            className="w-full border rounded-lg px-3 py-2"
            value={form.no}
            onChange={(e) =>
              setForm({ ...form, no: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Nama Kandidat"
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="URL Foto Kandidat"
            className="w-full border rounded-lg px-3 py-2"
            value={form.photo}
            onChange={(e) =>
              setForm({ ...form, photo: e.target.value })
            }
          />

          <textarea
            placeholder="Visi"
            className="w-full border rounded-lg px-3 py-2"
            rows={2}
            value={form.vision}
            onChange={(e) =>
              setForm({ ...form, vision: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Misi"
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            value={form.mission}
            onChange={(e) =>
              setForm({ ...form, mission: e.target.value })
            }
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
