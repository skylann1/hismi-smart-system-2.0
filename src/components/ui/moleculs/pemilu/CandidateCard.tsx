// components/CandidateCard.tsx
import Image from 'next/image'

type Candidate = {
  id: string
  no: number
  name: string
  vision: string
  votes: number
  photo: string
}

export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="relative h-40">
        <Image
          src={candidate.photo}
          alt={candidate.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <span className="text-sm text-gray-500">
          No. {candidate.no}
        </span>

        <h2 className="text-lg font-semibold">
          {candidate.name}
        </h2>

        <p className="text-sm text-gray-600 line-clamp-2">
          {candidate.vision}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            👁 {candidate.votes} suara
          </span>

          <div className="flex gap-2">
            <button className="text-blue-600 text-sm">
              Edit
            </button>
            <button className="text-red-600 text-sm">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
