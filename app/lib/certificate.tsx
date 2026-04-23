import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const PINK = '#d4537e'
const LIGHT_PINK = '#fbeaf0'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  // Decorative border frame
  outerBorder: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    border: `2px solid ${PINK}`,
    borderRadius: 8,
  },
  innerBorder: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: `0.5px solid #f0c0d0`,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  // Top pink bar
  topBar: {
    backgroundColor: PINK,
    height: 8,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomBar: {
    backgroundColor: PINK,
    height: 8,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Logo
  logo: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  logoPink: {
    color: PINK,
  },
  // Lines
  topLine: {
    width: 120,
    height: 2,
    backgroundColor: PINK,
    marginBottom: 20,
    marginTop: 4,
  },
  bottomLine: {
    width: 120,
    height: 2,
    backgroundColor: PINK,
    marginTop: 20,
    marginBottom: 20,
  },
  // Certificate heading
  heading: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 28,
  },
  // Student name
  studentName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  nameUnderline: {
    width: 280,
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  // Completion text
  completionText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  // Course name
  courseName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 480,
  },
  // Footer row
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  footerBlock: {
    alignItems: 'center',
    width: 160,
  },
  footerLine: {
    width: 130,
    height: 1,
    backgroundColor: '#d1d5db',
    marginBottom: 6,
  },
  footerLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footerValue: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  // Badge
  badge: {
    backgroundColor: LIGHT_PINK,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 28,
  },
  badgeText: {
    fontSize: 11,
    color: PINK,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
})

export type CertLocale = 'tr' | 'ru' | 'en'

const LABELS: Record<CertLocale, { heading: string; sub: string; completion: string; date: string; certNo: string; instructor: string }> = {
  tr: {
    heading: 'SERTİFİKA',
    sub: 'CERTIFICATE OF COMPLETION',
    completion: 'başarıyla tamamladı',
    date: 'Tarih',
    certNo: 'Sertifika No',
    instructor: 'Eğitmen',
  },
  ru: {
    heading: 'СЕРТИФИКАТ',
    sub: 'CERTIFICATE OF COMPLETION',
    completion: 'успешно завершил(а)',
    date: 'Дата',
    certNo: 'Номер',
    instructor: 'Преподаватель',
  },
  en: {
    heading: 'CERTIFICATE',
    sub: 'OF COMPLETION',
    completion: 'has successfully completed',
    date: 'Date',
    certNo: 'Certificate No',
    instructor: 'Instructor',
  },
}

interface CertificateProps {
  studentName: string
  courseName: string
  issuedAt: string
  certId: string
  locale?: CertLocale
}

export function CertificateDocument({
  studentName,
  courseName,
  issuedAt,
  certId,
  locale = 'tr',
}: CertificateProps) {
  const L = LABELS[locale]

  return (
    <Document title={`${L.heading} - ${studentName}`} author="MyCakeAleks">
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Color bars */}
        <View style={styles.topBar} />
        <View style={styles.bottomBar} />

        {/* Decorative borders */}
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo */}
          <Text style={styles.logo}>
            {'My'}
            <Text style={styles.logoPink}>{'Cake'}</Text>
            {'Aleks'}
          </Text>
          <View style={styles.topLine} />

          {/* Certificate heading */}
          <Text style={styles.heading}>{L.heading}</Text>
          <Text style={styles.subheading}>{L.sub}</Text>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ MyCakeAleks</Text>
          </View>

          {/* Student name */}
          <Text style={styles.studentName}>{studentName}</Text>
          <View style={styles.nameUnderline} />

          {/* Completion text */}
          <Text style={styles.completionText}>{L.completion}</Text>

          {/* Course name */}
          <Text style={styles.courseName}>{courseName}</Text>

          <View style={styles.bottomLine} />

          {/* Footer */}
          <View style={styles.footerRow}>
            <View style={styles.footerBlock}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>{L.instructor}</Text>
              <Text style={styles.footerValue}>Aleksandra</Text>
            </View>
            <View style={styles.footerBlock}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>{L.date}</Text>
              <Text style={styles.footerValue}>{issuedAt}</Text>
            </View>
            <View style={styles.footerBlock}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>{L.certNo}</Text>
              <Text style={[styles.footerValue, { fontSize: 9, color: '#9ca3af' }]}>
                {certId.slice(0, 16).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
