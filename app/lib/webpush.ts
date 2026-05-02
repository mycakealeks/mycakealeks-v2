import webpush from 'web-push'

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:support@mycakealeks.com.tr',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  title: string,
  body: string,
  url: string = '/',
) {
  const payload = JSON.stringify({ title, body, url })
  await webpush.sendNotification(subscription, payload)
}

export { webpush }
