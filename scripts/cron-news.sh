#!/bin/bash
# Daily news generation — run via crontab:
# 0 6 * * * /root/mycakealeks-v2/scripts/cron-news.sh >> /var/log/cron-news.log 2>&1

SITE_URL="${SITE_URL:-https://mycakealeks.com.tr}"
CRON_SECRET="${CRON_SECRET:?CRON_SECRET env var is required}"

curl -s -X POST "${SITE_URL}/api/news/generate" \
  -H "x-cron-secret: ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  --max-time 60 \
  && echo "[$(date)] News generation OK" \
  || echo "[$(date)] News generation FAILED"
