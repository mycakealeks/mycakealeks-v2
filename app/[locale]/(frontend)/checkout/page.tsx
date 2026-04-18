import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import PaymentButton from '@/app/[locale]/components/PaymentButton'

interface CheckoutPageProps {
  searchParams: Promise<{ courseId?: string; plan?: string; type?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const t = await getTranslations()
  const { courseId, plan, type = 'one_time' } = await searchParams

  // TODO: fetch real course data from Payload
  const course = courseId
    ? { id: courseId, title: `Course ${courseId}`, price: 49 }
    : null

  const isSubscription = type === 'subscription'
  const amount = isSubscription ? (plan === 'yearly' ? 199 : 29) : (course?.price ?? 49)

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <LanguageSwitcher />
      </nav>

      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('payment.checkout')}</h1>
        <p className="text-gray-500 mb-8">{t('payment.selectMethod')}</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {isSubscription ? (
            <>
              <h2 className="text-xl font-bold mb-1">{t('payment.subscription')}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {plan === 'yearly' ? t('payment.yearly') : t('payment.monthly')}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">{t('payment.oneTime')}</h2>
              {course && <p className="text-gray-500 text-sm mb-4">{course.title}</p>}
            </>
          )}

          <div className="flex items-center justify-between py-3 border-t">
            <span className="text-gray-700">{t('payment.total')}</span>
            <span className="text-2xl font-bold text-pink-600">
              {amount} {process.env.NEXT_PUBLIC_PAYMENT_CURRENCY ?? 'TRY'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          {/* TODO: replace 'guest_user' with real userId from session */}
          <PaymentButton
            courseId={courseId}
            userId="guest_user"
            amount={amount}
            purchaseType={isSubscription ? 'subscription' : 'one_time'}
            plan={plan as 'monthly' | 'yearly' | undefined}
          />
          <Link
            href="/courses"
            className="block text-center text-gray-500 hover:text-pink-600 text-sm mt-2"
          >
            {t('payment.cancel')}
          </Link>
        </div>
      </div>
    </main>
  )
}
