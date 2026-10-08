import { useState } from 'react'
import type { Professional, Verification } from './model'
import { LocalizedText } from '../../localization/LocalizedText'

function Portrait({ image }: { image?: string }) {
  const [failed, setFailed] = useState(false)
  if (!image || failed) return <div className="portrait-fallback" aria-hidden="true">✳</div>
  return <img className="portrait" src={image} alt="" width={56} height={56} onError={() => setFailed(true)} />
}

export function VerificationBadge({ status }: { status?: Verification }) {
  const label = status === 'verified' ? 'verification.verified'
    : status === 'not-verified' ? 'verification.notVerified' : 'verification.unavailable'
  return <span className={`verification ${status === 'verified' ? 'verified' : 'neutral'}`}>
    {status === 'verified' && <span aria-hidden="true">✓ </span>}<LocalizedText messageKey={label} />
  </span>
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const image = professional.image?.trim() || undefined
  const affiliation = professional.affiliation === 'vegan' ? 'affiliation.vegan'
    : professional.affiliation === 'vegan-friendly' ? 'affiliation.veganFriendly' : 'affiliation.unavailable'
  return <article className="professional-card">
    <div className="card-top">
      <Portrait key={image ?? 'absent'} image={image} />
      <span className="category">{professional.category?.trim()
        ? professional.categoryLabelKey ? <LocalizedText messageKey={professional.categoryLabelKey} /> : professional.category
        : <LocalizedText messageKey="category.unavailable" />}</span>
    </div>
    <h3>{professional.name?.trim() || <LocalizedText messageKey="name.unavailable" />}</h3>
    <p className="affiliation"><LocalizedText messageKey={affiliation} /></p>
    {professional.location?.trim() && <p className="location">{professional.locationLabelKey
      ? <LocalizedText messageKey={professional.locationLabelKey} /> : professional.location}</p>}
    <div className="card-verification"><VerificationBadge status={professional.verification} /></div>
  </article>
}
