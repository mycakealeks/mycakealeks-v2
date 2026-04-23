'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Sidebar from '@/app/[locale]/components/Sidebar'
import AuthGuard from '@/app/[locale]/components/AuthGuard'
import BottomNav from '@/app/[locale]/components/BottomNav'

const ALL_BADGES = [
  { type: 'first_lesson',  emoji: '🎯', labelKey: 'achievements.first_lesson',  condKey: 'achievements.cond_first_lesson' },
  { type: 'first_course',  emoji: '🎓', labelKey: 'achievements.first_course',  condKey: 'achievements.cond_first_course' },
  { type: 'streak_7days',  emoji: '🔥', labelKey: 'achievements.streak_7days',  condKey: 'achievements.cond_streak_7days' },
  { type: 'streak_30days', emoji: '💎', labelKey: 'achievements.streak_30days', condKey: 'achievements.cond_streak_30days' },
  { type: 'vip_student',   emoji: '👑', labelKey: 'achievements.vip_student',   condKey: 'achievements.cond_vip_student' },
  { type: 'all_courses',   emoji: '🏆', labelKey: 'achievements.all_courses',   condKey: 'achievements.cond_all_courses' },
]

const COUNTRIES = [
  { value: '', label: '—' },
  { value: 'TR', label: 'Türkiye' },
  { value: 'RU', label: 'Россия' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Deutschland' },
  { value: 'US', label: 'United States' },
  { value: 'FR', label: 'France' },
]

const LANGUAGES = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

function ProfileContent({ user }: { user: any }) {
  const t = useTranslations()
  const [firstName, setFirstName] = useState(user.firstName ?? '')
  const [lastName, setLastName] = useState(user.lastName ?? '')
  const [country, setCountry] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [earnedTypes, setEarnedTypes] = useState<Set<string>>(new Set())
  const [referral, setReferral] = useState<{ code: string; totalReferred: number; totalPoints: number } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/achievements', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const types = (d.achievements ?? []).map((a: any) => a.type)
        setEarnedTypes(new Set(types))
      })
      .catch(() => {})

    fetch('/api/referral/my', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setReferral(d))
      .catch(() => {})
  }, [])

  function copyReferralLink() {
    if (!referral) return
    const url = `https://mycakealeks.com.tr/register?ref=${referral.code}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'mismatch'>('idle')

  const userName = [firstName, lastName].filter(Boolean).join(' ') || user.email
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName }),
      })
      setSaveStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setPwStatus('mismatch'); return }
    setPwStatus('saving')
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword }),
      })
      if (res.ok) {
        setPwStatus('saved')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPwStatus('idle'), 2500)
      } else {
        setPwStatus('error')
      }
    } catch {
      setPwStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user.email} />
      <BottomNav />

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('profile.editTitle')}</h1>

          {/* Avatar block */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ background: '#d4537e' }}
            >
              {initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{userName}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              {memberSince && (
                <p className="text-xs text-gray-400 mt-1">{t('profile.memberSince')}: {memberSince}</p>
              )}
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">{t('profile.editTitle')}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('profile.name')}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                    placeholder="First name"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">&nbsp;</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.country')}
                </label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field">
                  {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.language')}
                </label>
                <select className="input-field">
                  {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60"
                >
                  {saveStatus === 'saving' ? t('profile.saving') : t('profile.save')}
                </button>
                {saveStatus === 'saved' && (
                  <span className="text-sm font-medium" style={{ color: '#16a34a' }}>✓ {t('profile.saved')}</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-sm font-medium text-red-500">{t('profile.saveError')}</span>
                )}
              </div>
            </form>
          </div>

          {/* Referral */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">{t('referral.title')}</h2>
            {referral ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl p-4 text-center" style={{ background: '#fbeaf0' }}>
                    <p className="text-2xl font-extrabold" style={{ color: '#d4537e' }}>{referral.totalReferred}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('referral.invited')}</p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: '#fbeaf0' }}>
                    <p className="text-2xl font-extrabold" style={{ color: '#d4537e' }}>{referral.totalPoints}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('referral.earned')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{t('referral.yourLink')}</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`https://mycakealeks.com.tr/register?ref=${referral.code}`}
                    className="input-field text-xs flex-1"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                    style={{ background: copied ? '#16a34a' : '#d4537e' }}
                  >
                    {copied ? '✓' : t('referral.copy')}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{t('referral.rewardDesc')}</p>
              </>
            ) : (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">{t('achievements.title')}</h2>
            <div className="grid grid-cols-3 gap-3">
              {ALL_BADGES.map((badge) => {
                const earned = earnedTypes.has(badge.type)
                return (
                  <div
                    key={badge.type}
                    className="flex flex-col items-center p-4 rounded-xl border transition-all"
                    style={
                      earned
                        ? { border: '1.5px solid #f0c0d0', background: '#fbeaf0' }
                        : { border: '1.5px solid #e5e7eb', background: '#f9fafb', opacity: 0.5 }
                    }
                    title={t(badge.condKey as any)}
                  >
                    <span className="text-3xl mb-2" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>
                      {badge.emoji}
                    </span>
                    <p className="text-xs font-semibold text-center text-gray-700 leading-snug">
                      {t(badge.labelKey as any)}
                    </p>
                    {earned && (
                      <span className="mt-1 text-xs font-bold" style={{ color: '#d4537e' }}>✓</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-5">{t('profile.changePassword')}</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pwStatus === 'saving'}
                  className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60"
                >
                  {pwStatus === 'saving' ? t('profile.saving') : t('profile.updatePassword')}
                </button>
                {pwStatus === 'mismatch' && <span className="text-sm text-red-500">{t('profile.passwordMismatch')}</span>}
                {pwStatus === 'saved' && <span className="text-sm font-medium" style={{ color: '#16a34a' }}>✓ {t('profile.passwordUpdated')}</span>}
                {pwStatus === 'error' && <span className="text-sm text-red-500">{t('profile.saveError')}</span>}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return <AuthGuard>{(user) => <ProfileContent user={user} />}</AuthGuard>
}
