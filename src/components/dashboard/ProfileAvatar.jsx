import { useState } from 'react'

const FB_ICON = (
  <svg width="22" height="22" fill="#1877F2" viewBox="0 0 24 24" aria-hidden>
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
)

/** صورة صفحة فيسبوك مع fallback عند فشل التحميل */
export function ProfileAvatar({ url, name, size = 42 }) {
  const [failed, setFailed] = useState(false)
  const showImg = Boolean(url) && !failed

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 10,
        background: 'rgba(24, 119, 242, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showImg ? (
        <img
          src={url}
          alt={name || ''}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        FB_ICON
      )}
    </div>
  )
}
