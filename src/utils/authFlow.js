export function applyAuthSuccess(data, navigate) {
  if (data.status !== 'success') return false
  localStorage.setItem('token', data.access)
  localStorage.setItem('refresh', data.refresh)
  navigate('/dashboard')
  return true
}

export function redirectAuthChallenge(data, navigate) {
  if (data.status === 'totp_setup_required') {
    navigate('/auth', {
      replace: true,
      state: {
        flow: 'totp-setup',
        challengeToken: data.challenge_token,
        qrImage: data.qr_image,
        manualKey: data.manual_key,
      },
    })
    return true
  }
  if (data.status === 'totp_required') {
    navigate('/auth', {
      replace: true,
      state: {
        flow: 'totp-verify',
        challengeToken: data.challenge_token,
      },
    })
    return true
  }
  return false
}

export function handleAuthResponse(data, navigate) {
  return applyAuthSuccess(data, navigate) || redirectAuthChallenge(data, navigate)
}
