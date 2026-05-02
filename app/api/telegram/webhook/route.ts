import { NextRequest, NextResponse } from 'next/server'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN

async function sendMessage(chatId: number | string, text: string) {
  if (!TOKEN) return
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

const COMMANDS: Record<string, string> = {
  '/start': `Merhaba! 🎂 <b>MyCakeAleks</b>'e hoş geldiniz!\n\nProfesyonel pasta kursları için: <a href="https://mycakealeks.com.tr">mycakealeks.com.tr</a>\n\n/courses — kurs listesi\n/help — yardım`,
  '/start@': `Merhaba! 🎂 <b>MyCakeAleks</b>`,
  '/courses': `📚 <b>Kurslarımız</b>\n\nTüm kursları görmek için:\n<a href="https://mycakealeks.com.tr/courses">mycakealeks.com.tr/courses</a>`,
  '/help': `🆘 <b>Destek</b>\n\nE-posta: support@mycakealeks.com.tr\nSite: <a href="https://mycakealeks.com.tr">mycakealeks.com.tr</a>`,
}

const DEFAULT_REPLY =
  '👋 Sorularınız için support@mycakealeks.com.tr adresine yazın veya <a href="https://mycakealeks.com.tr">mycakealeks.com.tr</a> adresini ziyaret edin.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text: string = message.text || ''
    const command = text.split('@')[0] // strip @BotUsername suffix

    const reply = COMMANDS[command] ?? DEFAULT_REPLY
    await sendMessage(chatId, reply)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('telegram webhook error:', err)
    return NextResponse.json({ ok: true }) // always 200 to Telegram
  }
}

// Verify webhook token via GET (Telegram doesn't use GET, but useful for testing)
export async function GET() {
  return NextResponse.json({ ok: true, bot: process.env.TELEGRAM_BOT_USERNAME || 'not configured' })
}
