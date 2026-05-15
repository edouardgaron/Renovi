'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image as PDFImage,
} from '@react-pdf/renderer'
import type { Project, Company } from '@/types'
import { formatDate, formatArea, formatDimension } from '@/lib/utils'
import { BUILDING_TYPE_LABELS, PHOTO_ANGLES } from '@/lib/constants'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 48,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: '2px solid #1B4FDE',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#1B4FDE',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4FDE',
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  headerCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerDate: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  // Title section
  titleSection: {
    marginBottom: 28,
  },
  reportBadge: {
    backgroundColor: '#EFF4FF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  reportBadgeText: {
    fontSize: 9,
    color: '#1B4FDE',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  projectAddress: {
    fontSize: 11,
    color: '#64748B',
  },
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionDot: {
    width: 4,
    height: 16,
    backgroundColor: '#1B4FDE',
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  // Info card
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    border: '1px solid #E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 9,
    color: '#1E293B',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  // Measurements grid
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  measurementBox: {
    width: '30%',
    backgroundColor: '#EFF4FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    border: '1px solid #DBEAFE',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4FDE',
    marginBottom: 2,
  },
  measurementLabel: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  // Photos
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    width: '48%',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 130,
    objectFit: 'cover',
    borderRadius: 6,
  },
  photoCaption: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  // Materials
  materialsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  materialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    gap: 6,
    flex: 1,
    border: '1px solid #E2E8F0',
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    border: '1px solid #E2E8F0',
  },
  materialLabel: {
    fontSize: 8,
    color: '#64748B',
  },
  materialValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #E2E8F0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  pageNumber: {
    fontSize: 8,
    color: '#94A3B8',
  },
})

interface PDFReportProps {
  project: Project
  company: Company
}

export default function PDFReport({ project, company }: PDFReportProps) {
  const m = project.measurements
  const mat = project.materials

  return (
    <Document
      title={`Rapport - ${project.name}`}
      author={company.name}
      subject="Rapport de rénovation extérieure"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>R</Text>
            </View>
            <Text style={styles.logoText}>Renovi</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerCompany}>{company.name}</Text>
            <Text style={styles.headerDate}>
              {company.phone} · {company.email}
            </Text>
            {company.license_number && (
              <Text style={styles.headerDate}>
                Lic. RBQ: {company.license_number}
              </Text>
            )}
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>Rapport de mesures</Text>
          </View>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <Text style={styles.projectAddress}>
            {project.address}, {project.city}, {project.province} {project.postal_code}
          </Text>
        </View>

        {/* Client Info */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>Informations du projet</Text>
        </View>
        <View style={styles.infoCard}>
          {project.client && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>{project.client.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Courriel</Text>
                <Text style={styles.infoValue}>{project.client.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{project.client.phone}</Text>
              </View>
            </>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type de bâtiment</Text>
            <Text style={styles.infoValue}>
              {BUILDING_TYPE_LABELS[project.building_type]?.fr}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date du rapport</Text>
            <Text style={styles.infoValue}>{formatDate(project.updated_at)}</Text>
          </View>
        </View>

        {/* Measurements */}
        {m.wall_surface && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Mesures calculées</Text>
            </View>
            <View style={styles.measurementsGrid}>
              {m.facade_width && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>
                    {formatDimension(m.facade_width)}
                  </Text>
                  <Text style={styles.measurementLabel}>Largeur façade</Text>
                </View>
              )}
              {m.building_height && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>
                    {formatDimension(m.building_height)}
                  </Text>
                  <Text style={styles.measurementLabel}>Hauteur</Text>
                </View>
              )}
              {m.wall_surface && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>
                    {formatArea(m.wall_surface)}
                  </Text>
                  <Text style={styles.measurementLabel}>Surface murale</Text>
                </View>
              )}
              {m.roof_surface && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>
                    {formatArea(m.roof_surface)}
                  </Text>
                  <Text style={styles.measurementLabel}>Surface toiture</Text>
                </View>
              )}
              {m.window_count !== null && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>{m.window_count}</Text>
                  <Text style={styles.measurementLabel}>Fenêtres</Text>
                </View>
              )}
              {m.door_count !== null && (
                <View style={styles.measurementBox}>
                  <Text style={styles.measurementValue}>{m.door_count}</Text>
                  <Text style={styles.measurementLabel}>Portes</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Photos */}
        {project.photos.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>
                Photos ({project.photos.length})
              </Text>
            </View>
            <View style={styles.photosGrid}>
              {project.photos.slice(0, 4).map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <PDFImage src={photo.url} style={styles.photo} />
                  <Text style={styles.photoCaption}>
                    {PHOTO_ANGLES[photo.angle]?.label_fr ?? photo.angle}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Renovi · {company.name} · {formatDate(project.updated_at)}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
