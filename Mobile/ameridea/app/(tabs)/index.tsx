import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { mockBillsPayable } from '@/data/mockData';
import { LogOut, FileText, DollarSign, Download } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function OverviewScreen() {
  const { user, logout } = useAuth();
  const [requestingLOA, setRequestingLOA] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  const handleLOARequest = async () => {
    setRequestingLOA(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequestingLOA(false);
      Alert.alert(
        'LOA Request Submitted',
        'Your Letter of Authorization request has been submitted successfully. You will receive an update within 2-3 business days.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true);
    
    // Simulate download
    setTimeout(() => {
      setDownloadingCert(false);
      Alert.alert(
        'Certificate Downloaded',
        'Your insurance certificate has been downloaded successfully.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const totalAmountDue = mockBillsPayable.reduce((sum, bill) => sum + bill.amount, 0);

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (!user) return null;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {getFirstName(user.fullName)}</Text>
              <Text style={styles.subtitle}>Welcome to your health portal</Text>
            </View>
            <Button
              title="Logout"
              onPress={logout}
              variant="secondary"
            />
          </View>

          {/* Policy Information */}
          <Card>
            <View style={styles.policyHeader}>
              <View style={styles.policyInfo}>
                <Text style={styles.policyLabel}>Active Policy Number</Text>
                <Text style={styles.policyNumber}>{user.policyNumber}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{user.policyStatus}</Text>
              </View>
            </View>
          </Card>

          {/* LOA Request Section */}
          <Card>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#2563EB" />
              <Text style={styles.sectionTitle}>Letter of Authorization</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Request authorization letters for medical procedures or specialist referrals.
            </Text>
            <View style={styles.buttonRow}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Request LOA"
                  onPress={handleLOARequest}
                  loading={requestingLOA}
                  variant="primary"
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Download Certificate"
                  onPress={handleDownloadCertificate}
                  loading={downloadingCert}
                  variant="secondary"
                />
              </View>
            </View>
          </Card>

          {/* Bills Payable Section */}
          <Card>
            <View style={styles.sectionHeader}>
              <DollarSign size={24} color="#DC2626" />
              <Text style={styles.sectionTitle}>Bills Payable</Text>
            </View>
            
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>Total Amount Due</Text>
              <Text style={styles.totalAmount}>${totalAmountDue.toFixed(2)}</Text>
            </View>

            {mockBillsPayable.map((bill) => (
              <View key={bill.id} style={styles.billItem}>
                <View style={styles.billInfo}>
                  <Text style={styles.billDescription}>{bill.description}</Text>
                  <Text style={styles.billDueDate}>Due: {new Date(bill.dueDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.billAmountContainer}>
                  <Text style={styles.billAmount}>${bill.amount.toFixed(2)}</Text>
                  <View style={[
                    styles.billStatusBadge,
                    bill.status === 'Overdue' ? styles.overdueBadge : styles.pendingBadge
                  ]}>
                    <Text style={[
                      styles.billStatusText,
                      bill.status === 'Overdue' ? styles.overdueText : styles.pendingText
                    ]}>
                      {bill.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <Text style={styles.billsNote}>
              * Amount due reflects costs over your insurance cap or deductible requirements.
            </Text>
          </Card>

          {/* Placeholder Cards for Future Features */}
          <Card style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>Recent Claims</Text>
            <Text style={styles.placeholderText}>
              View and track your recent insurance claims here.
            </Text>
            <Text style={styles.comingSoonText}>Coming in Phase 2</Text>
          </Card>

          <Card style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>Coverage Details</Text>
            <Text style={styles.placeholderText}>
              Review your coverage limits, deductibles, and benefits.
            </Text>
            <Text style={styles.comingSoonText}>Coming in Phase 2</Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyInfo: {
    flex: 1,
  },
  policyLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  policyNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  totalAmountContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 14,
    color: '#7F1D1D',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  billInfo: {
    flex: 1,
  },
  billDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  billAmountContainer: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  billStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
  },
  billStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pendingText: {
    color: '#92400E',
  },
  overdueText: {
    color: '#DC2626',
  },
  billsNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
  },
  placeholderCard: {
    opacity: 0.7,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 8,
  },
});