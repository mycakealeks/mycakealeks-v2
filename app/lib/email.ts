import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = `MyCakeAleks <${process.env.EMAIL_FROM || 'noreply@mycakealeks.com.tr'}>`
const SITE = 'https://mycakealeks.com.tr'

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

function title(emoji: string, text: string): string {
  return `<div style="text-align:center;font-size:48px;margin-bottom:16px;">${emoji}</div>
  <h1 style="text-align:center;color:#1a1a1a;font-size:22px;font-weight:800;margin:0 0 12px;">${text}</h1>`
}

function subtitle(text: string): string {
  return `<p style="color:#6b7280;text-align:center;font-size:15px;line-height:1.65;margin:0 0 24px;">${text}</p>`
}

function divider(): string {
  return `<div style="border-top:1px solid #f3e8ed;margin:28px 0;"></div>`
}

function support(): string {
  return `<p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
    Sorularınız için <a href="mailto:support@mycakealeks.com.tr" style="color:#d4537e;">support@mycakealeks.com.tr</a>
  </p>`
}

// ── Welcome ───────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, firstName: string) {
  const name = firstName || 'Öğrenci'
  const html = layout(`
    ${title('🎂', `Hoş geldin, ${name}!`)}
    ${subtitle('MyCakeAleks\'e katıldığın için teşekkürler. Pasta yapma yolculuğun başlıyor!')}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Seni neler bekliyor?</p>
      <p style="margin:0;color:#1a1a1a;font-size:14px;line-height:1.7;">
        🎥 HD video dersler &nbsp;·&nbsp; 🤖 AI asistan &nbsp;·&nbsp; 🏆 Sertifika
      </p>
    </div>
    ${btn(`${SITE}/courses`, 'Kurslara Göz At →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `🎂 MyCakeAleks'e Hoş Geldiniz, ${name}!`,
    html,
  })
}

// ── Purchase confirmation ─────────────────────────────────────────────────────
export async function sendPurchaseConfirmation(
  email: string,
  firstName: string,
  courseName: string,
  amount: number,
) {
  const name = firstName || 'Öğrenci'
  const orderId = Date.now().toString(36).toUpperCase()
  const html = layout(`
    ${title('✅', 'Ödeme Başarılı!')}
    ${subtitle(`Merhaba ${name}, ödemeniz alındı. Kursa erişiminiz hazır!`)}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Satın Alınan Kurs</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:18px;font-weight:700;">${courseName}</p>
      <p style="margin:0;color:#d4537e;font-size:22px;font-weight:800;">${amount} TRY</p>
    </div>
    <p style="color:#c4b5b5;font-size:12px;text-align:center;margin-bottom:20px;">Sipariş No: ${orderId}</p>
    ${btn(`${SITE}/dashboard`, 'Kursuma Git →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `✅ Ödeme Onayı — ${courseName}`,
    html,
  })
}

// ── Course access ─────────────────────────────────────────────────────────────
export async function sendCourseAccess(
  email: string,
  firstName: string,
  courseName: string,
  courseSlug: string,
) {
  const name = firstName || 'Öğrenci'
  const courseUrl = `${SITE}/courses/${courseSlug}`
  const html = layout(`
    ${title('🔓', 'Erişiminiz Açıldı!')}
    ${subtitle(`Tebrikler ${name}! <strong style="color:#1a1a1a;">${courseName}</strong> kursuna tam erişiminiz var.`)}
    <div style="background:#f0fdf4;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#16a34a;font-size:14px;text-align:center;font-weight:600;">
        ✓ Tüm dersler açık &nbsp;·&nbsp; ✓ Materyaller hazır &nbsp;·&nbsp; ✓ Sertifika dahil
      </p>
    </div>
    ${btn(courseUrl, 'Öğrenmeye Başla →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `🔓 ${courseName} — Kurs Erişiminiz Hazır`,
    html,
  })
}

// ── Abandoned cart ───────────────────────────────────────────────────────────
export async function sendAbandonedCartEmail(
  email: string,
  firstName: string,
  courseName: string,
  courseSlug: string,
) {
  const name = firstName || 'Öğrenci'
  const courseUrl = `${SITE}/courses/${courseSlug}`
  const html = layout(`
    ${title('🎂', 'Kursunuz sizi bekliyor!')}
    ${subtitle(`Merhaba ${name}, <strong style="color:#1a1a1a;">${courseName}</strong> kursuna göz attınız ama satın almayı tamamlamadınız.`)}
    <div style="background:#fdf2f6;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">Bu kurs ile öğrenecekleriniz:</p>
      <p style="margin:0;color:#1a1a1a;font-size:14px;line-height:1.8;">
        🎥 HD video dersler &nbsp;·&nbsp; 🏆 Sertifika &nbsp;·&nbsp; 🤖 AI asistan
      </p>
    </div>
    ${btn(`${courseUrl}`, 'Satın Al →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `🎂 Kursunuz sizi bekliyor — ${courseName}`,
    html,
  })
}

// ── Course completion ─────────────────────────────────────────────────────────
export async function sendCourseCompletionEmail(
  email: string,
  firstName: string,
  courseName: string,
) {
  const name = firstName || 'Öğrenci'
  const html = layout(`
    ${title('🏆', `Tebrikler, ${name}!`)}
    ${subtitle(`<strong style="color:#1a1a1a;">${courseName}</strong> kursunu başarıyla tamamladınız!`)}
    <div style="background:#f0fdf4;border-radius:16px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#16a34a;font-size:14px;font-weight:700;">
        🎓 Sertifikanız hazır — hemen indirin!
      </p>
    </div>
    ${btn(`${SITE}/my-courses`, 'Sertifikamı İndir →')}
    ${divider()}
    <p style="color:#6b7280;font-size:14px;text-align:center;margin:0 0 16px;">
      Bir sonraki kursa göz atmak ister misiniz?
    </p>
    ${btn(`${SITE}/courses`, 'Diğer Kurslara Bak →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `🏆 Tebrikler! ${courseName} kursunu tamamladınız`,
    html,
  })
}

// ── Weekly progress ───────────────────────────────────────────────────────────
export async function sendWeeklyProgressEmail(
  email: string,
  firstName: string,
  stats: { lessonsThisWeek: number; totalLessons: number; coursesInProgress: number },
) {
  const name = firstName || 'Öğrenci'
  const { lessonsThisWeek, totalLessons, coursesInProgress } = stats
  const html = layout(`
    ${title('📊', `Bu hafta nasıl geçti, ${name}?`)}
    ${subtitle('İşte bu haftaki öğrenme istatistikleriniz:')}
    <div style="background:#fdf2f6;border-radius:16px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${lessonsThisWeek}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Bu hafta ders</p>
          </td>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${totalLessons}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Toplam ders</p>
          </td>
          <td align="center" style="padding:8px;">
            <p style="margin:0;font-size:32px;font-weight:900;color:#d4537e;">${coursesInProgress}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Devam eden kurs</p>
          </td>
        </tr>
      </table>
    </div>
    <p style="color:#6b7280;font-size:14px;text-align:center;margin:0 0 20px;">
      ${lessonsThisWeek === 0
        ? 'Bu hafta henüz ders yapmadınız. Bugün başlamak için harika bir gün! 💪'
        : `Harika gidiyorsunuz! Devam edin 🚀`}
    </p>
    ${btn(`${SITE}/dashboard`, 'Öğrenmeye Devam Et →')}
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `📊 Haftalık İlerleme Raporunuz — MyCakeAleks`,
    html,
  })
}

// ── Password reset ────────────────────────────────────────────────────────────
export async function sendPasswordReset(
  email: string,
  firstName: string,
  resetLink: string,
) {
  const name = firstName || 'Kullanıcı'
  const html = layout(`
    ${title('🔑', 'Şifre Sıfırlama')}
    ${subtitle(`Merhaba ${name}, şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bağlantı <strong>1 saat</strong> geçerlidir.`)}
    ${btn(resetLink, 'Şifreyi Sıfırla →')}
    <div style="background:#fdf2f6;border-radius:12px;padding:14px 20px;margin-top:8px;">
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
        Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
      </p>
    </div>
    ${divider()}
    ${support()}
  `)
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: '🔑 MyCakeAleks — Şifre Sıfırlama',
    html,
  })
}
