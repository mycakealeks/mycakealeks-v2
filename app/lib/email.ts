import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = `MyCakeAleks <${process.env.EMAIL_FROM || 'noreply@mycakealeks.com.tr'}>`
const SITE = 'https://mycakealeks.com.tr'

type Locale = 'tr' | 'ru' | 'en'
const safeLocale = (l?: string): Locale =>
  l === 'ru' || l === 'en' ? l : 'tr'

// ── Translations ──────────────────────────────────────────────────────────────
const I18N = {
  tr: {
    welcome: {
      subject: (n: string) => `🎂 MyCakeAleks'e Hoş Geldiniz, ${n}!`,
      greeting: (n: string) => `Hoş geldin, ${n}!`,
      body: "MyCakeAleks'e katıldığın için teşekkürler. Pasta yapma yolculuğun başlıyor!",
      featuresLabel: 'Seni neler bekliyor?',
      features: '🎥 HD video dersler &nbsp;·&nbsp; 🤖 AI asistan &nbsp;·&nbsp; 🏆 Sertifika',
      button: 'Kurslara Göz At →',
    },
    passwordReset: {
      subject: '🔐 Şifre sıfırlama — MyCakeAleks',
      title: 'Şifre Sıfırlama',
      body: (n: string) => `Merhaba ${n}, şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bağlantı <strong>1 saat</strong> geçerlidir.`,
      button: 'Şifremi Sıfırla →',
      warning: 'Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.',
    },
    passwordChanged: {
      subject: '✅ Şifreniz değiştirildi — MyCakeAleks',
      title: 'Şifre Güncellendi',
      body: (n: string) => `Merhaba ${n}, şifreniz başarıyla güncellendi.`,
      warning: 'Şifrenizi siz değiştirmediyseniz hemen support@mycakealeks.com.tr adresine yazın.',
    },
    purchase: {
      subject: (c: string) => `🎉 Satın alma onaylandı — ${c}`,
      title: 'Ödeme Başarılı!',
      body: (n: string) => `Merhaba ${n}, ödemeniz alındı. Kursa erişiminiz hazır!`,
      courseLabel: 'Satın Alınan Kurs',
      orderLabel: 'Sipariş No',
      button: 'Kursuma Git →',
    },
    courseAccess: {
      subject: (c: string) => `🔓 ${c} — Kurs Erişiminiz Hazır`,
      title: 'Erişiminiz Açıldı!',
      body: (n: string, c: string) => `Tebrikler ${n}! <strong style="color:#1a1a1a;">${c}</strong> kursuna tam erişiminiz var.`,
      features: '✓ Tüm dersler açık &nbsp;·&nbsp; ✓ Materyaller hazır &nbsp;·&nbsp; ✓ Sertifika dahil',
      button: 'Öğrenmeye Başla →',
    },
    courseComplete: {
      subject: (c: string) => `🏆 Tebrikler! ${c} kursunu tamamladınız`,
      title: (n: string) => `Tebrikler, ${n}!`,
      body: (c: string) => `<strong style="color:#1a1a1a;">${c}</strong> kursunu başarıyla tamamladınız!`,
      certLabel: '🎓 Sertifikanız hazır — hemen indirin!',
      certButton: 'Sertifikamı İndir →',
      moreLabel: 'Bir sonraki kursa göz atmak ister misiniz?',
      moreButton: 'Diğer Kurslara Bak →',
    },
    verification: {
      subject: 'Email adresinizi doğrulayın - MyCakeAleks',
      title: 'E-posta adresinizi doğrulayın',
      body: (n: string) => `Merhaba ${n}! Kayıt işleminizi tamamlamak için e-posta adresinizi doğrulayın. Bağlantı <strong>24 saat</strong> geçerlidir.`,
      button: 'Doğrula →',
      warning: 'Bu kaydı siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.',
    },
  },
  ru: {
    welcome: {
      subject: (n: string) => `🎂 Добро пожаловать в MyCakeAleks, ${n}!`,
      greeting: (n: string) => `Добро пожаловать, ${n}!`,
      body: 'Спасибо за регистрацию в MyCakeAleks. Ваш путь к кондитерскому мастерству начинается!',
      featuresLabel: 'Вас ждёт:',
      features: '🎥 HD-видеоуроки &nbsp;·&nbsp; 🤖 AI-ассистент &nbsp;·&nbsp; 🏆 Сертификат',
      button: 'Смотреть курсы →',
    },
    passwordReset: {
      subject: '🔐 Сброс пароля — MyCakeAleks',
      title: 'Сброс пароля',
      body: (n: string) => `Здравствуйте, ${n}! Нажмите кнопку ниже, чтобы сбросить пароль. Ссылка действительна <strong>1 час</strong>.`,
      button: 'Сбросить пароль →',
      warning: 'Если вы не запрашивали сброс пароля, проигнорируйте это письмо.',
    },
    passwordChanged: {
      subject: '✅ Пароль изменён — MyCakeAleks',
      title: 'Пароль обновлён',
      body: (n: string) => `Здравствуйте, ${n}! Ваш пароль был успешно изменён.`,
      warning: 'Если вы не меняли пароль — немедленно напишите на support@mycakealeks.com.tr.',
    },
    purchase: {
      subject: (c: string) => `🎉 Покупка подтверждена — ${c}`,
      title: 'Оплата прошла успешно!',
      body: (n: string) => `Здравствуйте, ${n}! Ваш платёж принят. Доступ к курсу открыт!`,
      courseLabel: 'Приобретённый курс',
      orderLabel: 'Номер заказа',
      button: 'Перейти к курсу →',
    },
    courseAccess: {
      subject: (c: string) => `🔓 Доступ к курсу «${c}» открыт`,
      title: 'Доступ открыт!',
      body: (n: string, c: string) => `Поздравляем, ${n}! У вас полный доступ к курсу <strong style="color:#1a1a1a;">${c}</strong>.`,
      features: '✓ Все уроки открыты &nbsp;·&nbsp; ✓ Материалы готовы &nbsp;·&nbsp; ✓ Сертификат включён',
      button: 'Начать обучение →',
    },
    courseComplete: {
      subject: (c: string) => `🏆 Поздравляем! Вы завершили курс «${c}»`,
      title: (n: string) => `Поздравляем, ${n}!`,
      body: (c: string) => `Вы успешно завершили курс <strong style="color:#1a1a1a;">${c}</strong>!`,
      certLabel: '🎓 Ваш сертификат готов — скачайте его!',
      certButton: 'Скачать сертификат →',
      moreLabel: 'Хотите пройти следующий курс?',
      moreButton: 'Смотреть курсы →',
    },
    verification: {
      subject: 'Подтвердите email — MyCakeAleks',
      title: 'Подтвердите email',
      body: (n: string) => `Здравствуйте, ${n}! Для завершения регистрации подтвердите email. Ссылка действительна <strong>24 часа</strong>.`,
      button: 'Подтвердить →',
      warning: 'Если вы не регистрировались, проигнорируйте это письмо.',
    },
  },
  en: {
    welcome: {
      subject: (n: string) => `🎂 Welcome to MyCakeAleks, ${n}!`,
      greeting: (n: string) => `Welcome, ${n}!`,
      body: 'Thank you for joining MyCakeAleks. Your cake-making journey starts now!',
      featuresLabel: "What's waiting for you:",
      features: '🎥 HD video lessons &nbsp;·&nbsp; 🤖 AI assistant &nbsp;·&nbsp; 🏆 Certificate',
      button: 'Browse Courses →',
    },
    passwordReset: {
      subject: '🔐 Password reset — MyCakeAleks',
      title: 'Password Reset',
      body: (n: string) => `Hi ${n}, click the button below to reset your password. Link valid for <strong>1 hour</strong>.`,
      button: 'Reset Password →',
      warning: "If you didn't request this, you can safely ignore this email.",
    },
    passwordChanged: {
      subject: '✅ Password changed — MyCakeAleks',
      title: 'Password Updated',
      body: (n: string) => `Hi ${n}, your password has been successfully updated.`,
      warning: "If you didn't change your password, contact support@mycakealeks.com.tr immediately.",
    },
    purchase: {
      subject: (c: string) => `🎉 Purchase confirmed — ${c}`,
      title: 'Payment Successful!',
      body: (n: string) => `Hi ${n}, your payment was received. Course access is ready!`,
      courseLabel: 'Purchased Course',
      orderLabel: 'Order No',
      button: 'Go to My Course →',
    },
    courseAccess: {
      subject: (c: string) => `🔓 Course access ready — ${c}`,
      title: 'Access Granted!',
      body: (n: string, c: string) => `Congratulations ${n}! You have full access to <strong style="color:#1a1a1a;">${c}</strong>.`,
      features: '✓ All lessons open &nbsp;·&nbsp; ✓ Materials ready &nbsp;·&nbsp; ✓ Certificate included',
      button: 'Start Learning →',
    },
    courseComplete: {
      subject: (c: string) => `🏆 Congratulations! You completed "${c}"`,
      title: (n: string) => `Congratulations, ${n}!`,
      body: (c: string) => `You have successfully completed <strong style="color:#1a1a1a;">${c}</strong>!`,
      certLabel: '🎓 Your certificate is ready — download it now!',
      certButton: 'Download Certificate →',
      moreLabel: 'Want to explore more courses?',
      moreButton: 'Browse Courses →',
    },
    verification: {
      subject: 'Verify your email - MyCakeAleks',
      title: 'Verify your email',
      body: (n: string) => `Hi ${n}! Please verify your email to complete registration. Link valid for <strong>24 hours</strong>.`,
      button: 'Verify →',
      warning: "If you didn't sign up, please ignore this email.",
    },
  },
}

// ── Base layout ───────────────────────────────────────────────────────────────
function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#fdf2f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf2f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <a href="${SITE}" style="text-decoration:none;font-size:26px;font-weight:900;color:#1a1a1a;">
            My<span style="color:#d4537e;">Cake</span>Aleks
          </a>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:24px;padding:40px 36px;box-shadow:0 4px 32px rgba(212,83,126,0.10);">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:28px;color:#9ca3af;font-size:12px;line-height:1.7;">
          <p style="margin:0;">© 2026 MyCakeAleks · <a href="${SITE}" style="color:#d4537e;text-decoration:none;">${SITE}</a></p>
          <p style="margin:4px 0 0;"><a href="${SITE}/unsubscribe" style="color:#c4b5b5;text-decoration:none;">Aboneliği iptal et</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(href: string, label: string): string {
  return `<div style="text-align:center;margin:28px 0 8px;">
    <a href="${href}" style="display:inline-block;background:#d4537e;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.01em;">${label}</a>
  </div>`
}

function titleBlock(emoji: string, text: string): string {
  return `<div style="text-align:center;font-size:48px;margin-bottom:16px;">${emoji}</div>
  <h1 style="text-align:center;color:#1a1a1a;font-size:22px;font-weight:800;margin:0 0 12px;">${text}</h1>`
}

function subtitleBlock(text: string): string {
  return `<p style="color:#6b7280;text-align:center;font-size:15px;line-height:1.65;margin:0 0 24px;">${text}</p>`
}

function divider(): string {
  return `<div style="border-top:1px solid #f3e8ed;margin:28px 0;"></div>`
}

function support(): string {
  return `<p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
    <a href="mailto:support@mycakealeks.com.tr" style="color:#d4537e;">support@mycakealeks.com.tr</a>
  </p>`
}

function warningBox(text: string): string {
  return `<div style="background:#fdf2f6;border-radius:12px;padding:14px 20px;margin-top:8px;">
    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">${text}</p>
  </div>`
}

// ── Welcome ───────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, firstName: string, locale = 'tr') {
  const L = safeLocale(locale)
  const tr = I18N[L].welcome
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'Student' : 'Öğrenci')
  const html = layout(`
    ${titleBlock('🎂', tr.greeting(name))}
    ${subtitleBlock(tr.body)}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">${tr.featuresLabel}</p>
      <p style="margin:0;color:#1a1a1a;font-size:14px;line-height:1.7;">${tr.features}</p>
    </div>
    ${btn(`${SITE}/courses`, tr.button)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject(name), html })
}

// ── Purchase confirmation ─────────────────────────────────────────────────────
export async function sendPurchaseConfirmation(
  email: string,
  firstName: string,
  courseName: string,
  amount: number,
  locale = 'tr',
) {
  const L = safeLocale(locale)
  const tr = I18N[L].purchase
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'Student' : 'Öğrenci')
  const orderId = Date.now().toString(36).toUpperCase()
  const html = layout(`
    ${titleBlock('✅', tr.title)}
    ${subtitleBlock(tr.body(name))}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">${tr.courseLabel}</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:18px;font-weight:700;">${courseName}</p>
      <p style="margin:0;color:#d4537e;font-size:22px;font-weight:800;">${amount} TRY</p>
    </div>
    <p style="color:#c4b5b5;font-size:12px;text-align:center;margin-bottom:20px;">${tr.orderLabel}: ${orderId}</p>
    ${btn(`${SITE}/dashboard`, tr.button)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject(courseName), html })
}

// ── Course access ─────────────────────────────────────────────────────────────
export async function sendCourseAccess(
  email: string,
  firstName: string,
  courseName: string,
  courseSlug: string,
  locale = 'tr',
) {
  const L = safeLocale(locale)
  const tr = I18N[L].courseAccess
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'Student' : 'Öğrenci')
  const courseUrl = `${SITE}/courses/${courseSlug}`
  const html = layout(`
    ${titleBlock('🔓', tr.title)}
    ${subtitleBlock(tr.body(name, courseName))}
    <div style="background:#f0fdf4;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#16a34a;font-size:14px;text-align:center;font-weight:600;">${tr.features}</p>
    </div>
    ${btn(courseUrl, tr.button)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject(courseName), html })
}

// ── Abandoned cart ───────────────────────────────────────────────────────────
export async function sendAbandonedCartEmail(
  email: string,
  firstName: string,
  courseName: string,
  courseSlug: string,
  locale = 'tr',
) {
  const name = firstName || 'Öğrenci'
  const courseUrl = `${SITE}/courses/${courseSlug}`
  const subjects: Record<string, string> = {
    tr: `🎂 Kursunuz sizi bekliyor — ${courseName}`,
    ru: `🎂 Курс ждёт вас — ${courseName}`,
    en: `🎂 Your course is waiting — ${courseName}`,
  }
  const bodies: Record<string, string> = {
    tr: `Merhaba ${name}, <strong style="color:#1a1a1a;">${courseName}</strong> kursuna göz attınız ama satın almayı tamamlamadınız.`,
    ru: `Здравствуйте, ${name}! Вы просматривали курс <strong style="color:#1a1a1a;">${courseName}</strong>, но не завершили покупку.`,
    en: `Hi ${name}, you browsed <strong style="color:#1a1a1a;">${courseName}</strong> but didn't complete the purchase.`,
  }
  const features: Record<string, string> = {
    tr: '🎥 HD video dersler &nbsp;·&nbsp; 🏆 Sertifika &nbsp;·&nbsp; 🤖 AI asistan',
    ru: '🎥 HD-видеоуроки &nbsp;·&nbsp; 🏆 Сертификат &nbsp;·&nbsp; 🤖 AI-ассистент',
    en: '🎥 HD video lessons &nbsp;·&nbsp; 🏆 Certificate &nbsp;·&nbsp; 🤖 AI assistant',
  }
  const buttons: Record<string, string> = {
    tr: 'Satın Al →', ru: 'Купить →', en: 'Buy Now →',
  }
  const L = safeLocale(locale)
  const html = layout(`
    ${titleBlock('🎂', subjects[L].split(' — ')[0].replace('🎂 ', ''))}
    ${subtitleBlock(bodies[L])}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#1a1a1a;font-size:14px;line-height:1.8;">${features[L]}</p>
    </div>
    ${btn(courseUrl, buttons[L])}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: subjects[L], html })
}

// ── Course completion ─────────────────────────────────────────────────────────
export async function sendCourseCompletionEmail(
  email: string,
  firstName: string,
  courseName: string,
  locale = 'tr',
) {
  const L = safeLocale(locale)
  const tr = I18N[L].courseComplete
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'Student' : 'Öğrenci')
  const html = layout(`
    ${titleBlock('🏆', tr.title(name))}
    ${subtitleBlock(tr.body(courseName))}
    <div style="background:#f0fdf4;border-radius:16px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#16a34a;font-size:14px;font-weight:700;">${tr.certLabel}</p>
    </div>
    ${btn(`${SITE}/my-courses`, tr.certButton)}
    ${divider()}
    <p style="color:#6b7280;font-size:14px;text-align:center;margin:0 0 16px;">${tr.moreLabel}</p>
    ${btn(`${SITE}/courses`, tr.moreButton)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject(courseName), html })
}

// ── Weekly progress ───────────────────────────────────────────────────────────
export async function sendWeeklyProgressEmail(
  email: string,
  firstName: string,
  stats: { lessonsThisWeek: number; totalLessons: number; coursesInProgress: number },
  locale = 'tr',
) {
  const name = firstName || 'Öğrenci'
  const { lessonsThisWeek, totalLessons, coursesInProgress } = stats
  const subjects: Record<string, string> = {
    tr: '📊 Haftalık İlerleme Raporunuz — MyCakeAleks',
    ru: '📊 Еженедельный отчёт об успехах — MyCakeAleks',
    en: '📊 Your Weekly Progress Report — MyCakeAleks',
  }
  const greetings: Record<string, string> = {
    tr: `Bu hafta nasıl geçti, ${name}?`,
    ru: `Как прошла неделя, ${name}?`,
    en: `How was your week, ${name}?`,
  }
  const subtitles: Record<string, string> = {
    tr: 'İşte bu haftaki öğrenme istatistikleriniz:',
    ru: 'Ваша статистика обучения за неделю:',
    en: 'Here are your learning stats for this week:',
  }
  const labels: Record<string, [string, string, string]> = {
    tr: ['Bu hafta ders', 'Toplam ders', 'Devam eden kurs'],
    ru: ['Уроков за неделю', 'Всего уроков', 'Курсов в процессе'],
    en: ['Lessons this week', 'Total lessons', 'Courses in progress'],
  }
  const motivations: Record<string, [string, string]> = {
    tr: ['Bu hafta henüz ders yapmadınız. Bugün başlamak için harika bir gün! 💪', 'Harika gidiyorsunuz! Devam edin 🚀'],
    ru: ['На этой неделе вы ещё не занимались. Сегодня — отличный день для старта! 💪', 'Отличный прогресс! Продолжайте 🚀'],
    en: ["You haven't studied this week yet. Today is a great day to start! 💪", 'Great progress! Keep it up 🚀'],
  }
  const buttons: Record<string, string> = {
    tr: 'Öğrenmeye Devam Et →', ru: 'Продолжить обучение →', en: 'Continue Learning →',
  }
  const L = safeLocale(locale)
  const [l1, l2, l3] = labels[L]
  const html = layout(`
    ${titleBlock('📊', greetings[L])}
    ${subtitleBlock(subtitles[L])}
    <div style="background:#fdf2f6;border-radius:16px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${lessonsThisWeek}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${l1}</p>
          </td>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${totalLessons}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${l2}</p>
          </td>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${coursesInProgress}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${l3}</p>
          </td>
        </tr>
      </table>
    </div>
    <p style="color:#6b7280;font-size:14px;text-align:center;margin:0 0 20px;">
      ${motivations[L][lessonsThisWeek === 0 ? 0 : 1]}
    </p>
    ${btn(`${SITE}/dashboard`, buttons[L])}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: subjects[L], html })
}

// ── Gift certificate ──────────────────────────────────────────────────────────
export async function sendGiftCertificateEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  amount: number,
  code: string,
  message: string,
  locale = 'tr',
) {
  const subjects: Record<string, string> = {
    tr: `🎁 ${senderName} sana ${amount} TRY hediye gönderdi — MyCakeAleks`,
    ru: `🎁 ${senderName} подарил вам ${amount} TRY — MyCakeAleks`,
    en: `🎁 ${senderName} sent you a ${amount} TRY gift — MyCakeAleks`,
  }
  const titles: Record<string, string> = {
    tr: `${recipientName}, sana hediye var!`,
    ru: `${recipientName}, вам подарок!`,
    en: `${recipientName}, you have a gift!`,
  }
  const fromLabels: Record<string, string> = {
    tr: `<strong style="color:#1a1a1a;">${senderName}</strong> sana MyCakeAleks hediye sertifikası gönderdi!`,
    ru: `<strong style="color:#1a1a1a;">${senderName}</strong> отправил(а) вам подарочный сертификат MyCakeAleks!`,
    en: `<strong style="color:#1a1a1a;">${senderName}</strong> sent you a MyCakeAleks gift certificate!`,
  }
  const amountLabels: Record<string, string> = {
    tr: 'Hediye Tutarı', ru: 'Сумма подарка', en: 'Gift Amount',
  }
  const codeLabels: Record<string, string> = {
    tr: 'SERTİFİKA KODU', ru: 'КОД СЕРТИФИКАТА', en: 'CERTIFICATE CODE',
  }
  const instructions: Record<string, string> = {
    tr: 'Bu kodu checkout sayfasında "Hediye Sertifikası" alanına girin. Son kullanma: 1 yıl.',
    ru: 'Введите код в поле «Подарочный сертификат» при оформлении заказа. Срок действия: 1 год.',
    en: 'Enter this code in the "Gift Certificate" field at checkout. Valid for 1 year.',
  }
  const buttons: Record<string, string> = {
    tr: 'Kurslara Göz At →', ru: 'Смотреть курсы →', en: 'Browse Courses →',
  }
  const L = safeLocale(locale)
  const html = layout(`
    ${titleBlock('🎁', titles[L])}
    ${subtitleBlock(fromLabels[L])}
    ${message ? `<div style="background:#fdf2f6;border-radius:16px;padding:18px 24px;margin-bottom:24px;border-left:4px solid #d4537e;">
      <p style="margin:0;color:#6b7280;font-size:13px;font-style:italic;">"${message}"</p>
    </div>` : ''}
    <div style="background:linear-gradient(135deg,#d4537e 0%,#e8799e 100%);border-radius:20px;padding:32px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:1px;text-transform:uppercase;">${amountLabels[L]}</p>
      <p style="margin:0 0 16px;color:#ffffff;font-size:48px;font-weight:900;">${amount} TRY</p>
      <div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:12px 20px;display:inline-block;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:2px;">${codeLabels[L]}</p>
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:4px;">${code}</p>
      </div>
    </div>
    <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 20px;">${instructions[L]}</p>
    ${btn(`${SITE}/courses`, buttons[L])}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: recipientEmail, subject: subjects[L], html })
}

// ── Email verification ────────────────────────────────────────────────────────
export async function sendVerificationEmail(email: string, firstName: string, token: string, locale = 'tr') {
  const L = safeLocale(locale)
  const tr = I18N[L].verification
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'User' : 'Kullanıcı')
  const verifyUrl = `${SITE}/verify-email?token=${token}`
  const html = layout(`
    ${titleBlock('📧', tr.title)}
    ${subtitleBlock(tr.body(name))}
    ${btn(verifyUrl, tr.button)}
    ${warningBox(tr.warning)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject, html })
}

// ── Password reset ────────────────────────────────────────────────────────────
export async function sendPasswordReset(
  email: string,
  firstName: string,
  resetLink: string,
  locale = 'tr',
) {
  const L = safeLocale(locale)
  const tr = I18N[L].passwordReset
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'User' : 'Kullanıcı')
  const html = layout(`
    ${titleBlock('🔑', tr.title)}
    ${subtitleBlock(tr.body(name))}
    ${btn(resetLink, tr.button)}
    ${warningBox(tr.warning)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject, html })
}

// ── Password changed ──────────────────────────────────────────────────────────
export async function sendPasswordChanged(email: string, firstName: string, locale = 'tr') {
  const L = safeLocale(locale)
  const tr = I18N[L].passwordChanged
  const name = firstName || (L === 'ru' ? 'Пользователь' : L === 'en' ? 'User' : 'Kullanıcı')
  const html = layout(`
    ${titleBlock('✅', tr.title)}
    ${subtitleBlock(tr.body(name))}
    ${warningBox(tr.warning)}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: tr.subject, html })
}
