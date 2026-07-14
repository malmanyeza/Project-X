import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { Card } from '../components';

interface LegalScreenProps {
  route: {
    params: {
      type: 'privacy' | 'terms';
    };
  };
  navigation: any;
}

export const LegalScreen: React.FC<LegalScreenProps> = ({ route, navigation }) => {
  const { type } = route.params || { type: 'privacy' };
  const isPrivacy = type === 'privacy';

  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const lastUpdated = isPrivacy ? 'May 25, 2026' : 'May 26, 2026';

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );

  const BulletPoint = ({ text }: { text: string }) => (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="cow" size={36} color={colors.textOnPrimary} />
          </View>
          <Text style={styles.brandName}>Project X</Text>
          <Text style={styles.lastUpdated}>Last Updated: {lastUpdated}</Text>
        </View>

        <Card style={styles.card}>
          {isPrivacy ? (
            <>
              <Text style={styles.bodyParagraph}>
                Welcome to <Text style={styles.boldText}>Project X</Text>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
              </Text>
              <Text style={styles.bodyParagraph}>
                This Privacy Policy applies to all information collected through our mobile application, website, and related services (collectively, the "Services").
              </Text>

              <Section title="1. Information We Collect">
                <Text style={styles.bodyParagraph}>
                  We collect personal information that you voluntarily provide to us when registering on the App, adding animal health records, or using our Services. This includes:
                </Text>
                <BulletPoint text="Account Information: Name, phone number, email address, password, and farm profiles." />
                <BulletPoint text="Livestock & Health Records: Animal types, health histories, treatment logs, diagnoses, and photos of livestock or symptoms uploaded by you." />
                <BulletPoint text="Location Information: We request access to your device's GPS location to help you coordinate with nearby veterinary doctors in our Vet Directory." />
                <BulletPoint text="AI Diagnostic Inputs: Text descriptions, chat history, and images sent to the AI Assistant for diagnostic evaluation." />
              </Section>

              <Section title="2. How We Use Your Information">
                <Text style={styles.bodyParagraph}>
                  We use the information we collect for operational and service delivery purposes, including:
                </Text>
                <BulletPoint text="Service Delivery: To manage farmer accounts, livestock directories, and veterinary records." />
                <BulletPoint text="AI Diagnostics: To process your queries and animal photos through secure artificial intelligence APIs to generate preliminary health assessments." />
                <BulletPoint text="Vet Matching: To use your coordinates to display veterinary doctors relative to your location and plan veterinary visits." />
                <BulletPoint text="Notifications: To send you alerts regarding treatment schedules, diagnostic results, and messaging notifications." />
              </Section>

              <Section title="3. How Your Information is Shared">
                <Text style={styles.bodyParagraph}>
                  We only share information with your consent, to comply with laws, or to provide you with Services. This includes sharing with:
                </Text>
                <BulletPoint text="Veterinary Professionals: If you connect with a veterinarian, we share your farm location and livestock history to facilitate care." />
                <BulletPoint text="Service Providers: Secure database hosting (Supabase), secure AI APIs (OpenAI/Anthropic without model training), and mapping tools." />
              </Section>

              <Section title="4. Data Storage and Security">
                <Text style={styles.bodyParagraph}>
                  We implement a variety of technical and physical security measures designed to protect your personal data. All account data and livestock records are stored securely with industry-standard encryption protocols.
                </Text>
              </Section>

              <Section title="5. Your Rights and Data Deletion">
                <Text style={styles.bodyParagraph}>
                  You have the right to access, correct, or request the deletion of your personal data. You can delete your farm records or your entire account directly through the settings interface in the mobile app, or by contacting our support team.
                </Text>
              </Section>

              <Section title="6. Changes to This Privacy Policy">
                <Text style={styles.bodyParagraph}>
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated Last Updated date at the top of this page.
                </Text>
              </Section>
            </>
          ) : (
            <>
              <Text style={styles.bodyParagraph}>
                By accessing or using the <Text style={styles.boldText}>Project X</Text> mobile application and services, you agree to be bound by these Terms of Service. Please read them carefully.
              </Text>

              <Section title="1. Professional Disclaimer (CRITICAL)">
                <View style={styles.warningBox}>
                  <Ionicons name="warning-outline" size={20} color={colors.error} />
                  <Text style={styles.warningText}>
                    Project X is an AI-powered educational screening tool. It does NOT provide certified veterinary diagnoses. It is designed to assist farmers with preliminary information, not to replace professional veterinary assessments, treatments, or medical interventions.
                  </Text>
                </View>
                <Text style={styles.bodyParagraph}>
                  Always consult a licensed veterinarian for definitive diagnostic answers and treatment paths for your livestock.
                </Text>
              </Section>

              <Section title="2. Account Registration & Eligibility">
                <Text style={styles.bodyParagraph}>
                  You must register an account to access features such as AI chat records, saved preliminary assessments, and veterinarian communication.
                </Text>
                <BulletPoint text="Farmers: Responsible for providing accurate symptom logs and livestock details." />
                <BulletPoint text="Veterinarians: Must represent accurate qualifications and license credentials when registering. We reserves the right to suspend accounts representing false credentials." />
              </Section>

              <Section title="3. User Content & Images">
                <Text style={styles.bodyParagraph}>
                  You own the intellectual property rights to the texts and images you upload. However, by uploading content, you grant us a secure, royalty-free license to transmit, store, and process this information to deliver the AI services.
                </Text>
              </Section>

              <Section title="4. Prohibited Activities">
                <Text style={styles.bodyParagraph}>
                  You agree not to engage in any activity that interferes with or disrupts our Services. This includes uploading harmful code, spamming veterinarians, or providing false licensing credentials.
                </Text>
              </Section>

              <Section title="5. Limitation of Liability">
                <Text style={styles.bodyParagraph}>
                  To the maximum extent permitted by law, Project X and its developers shall not be liable for any direct, indirect, or incidental damages resulting from livestock health outcomes, AI diagnostic screenings, or interactions arranged through the Vet Directory.
                </Text>
              </Section>
            </>
          )}

          {/* Contact Section */}
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Contact & Support</Text>
            <Text style={styles.contactSub}>If you have any questions or feedback, you can contact the technical and support department at:</Text>
            <View style={styles.contactDetailRow}>
              <Ionicons name="mail" size={16} color={colors.primary} />
              <Text style={styles.contactDetailText}>support@projectx.app</Text>
            </View>
            <View style={styles.contactDetailRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.contactDetailText}>Harare, Zimbabwe</Text>
            </View>
          </View>
        </Card>

        {/* Brand Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>&copy; 2026 Project X. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.h4 },
  scrollContent: { padding: spacing.xl, gap: spacing.lg },
  brandHeader: { alignItems: 'center', marginVertical: spacing.md, gap: spacing.sm },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  brandName: { ...typography.h3, fontWeight: '700' },
  lastUpdated: { ...typography.caption, color: colors.textSecondary },
  card: { padding: spacing.xl },
  bodyParagraph: { ...typography.bodySm, lineHeight: 20, color: colors.text, marginBottom: spacing.md },
  boldText: { fontWeight: '600' },
  section: { marginTop: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h4, color: colors.primary, marginBottom: spacing.xs },
  sectionDivider: { height: 2, backgroundColor: colors.borderLight, width: 40, marginBottom: spacing.md },
  bulletRow: { flexDirection: 'row', gap: spacing.sm, paddingLeft: spacing.xs, marginBottom: spacing.sm, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 7 },
  bulletText: { ...typography.bodySm, flex: 1, color: colors.textSecondary, lineHeight: 18 },
  warningBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  warningText: { ...typography.bodySm, flex: 1, color: colors.error, fontWeight: '500', lineHeight: 18 },
  contactInfo: {
    backgroundColor: colors.borderLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  contactTitle: { ...typography.bodyMedium, fontWeight: '700', color: colors.primary },
  contactSub: { ...typography.bodySm, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.xs },
  contactDetailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  contactDetailText: { ...typography.bodySm, color: colors.text, fontWeight: '500' },
  footer: { alignItems: 'center', marginTop: spacing.lg, paddingBottom: spacing.xxl },
  footerText: { ...typography.caption, color: colors.textTertiary },
});
