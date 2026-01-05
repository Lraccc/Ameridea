import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { mockBillsPayable, mockHistory } from '@/data/mockData';
import { LogOut, FileText, DollarSign, Download, Clock, ChevronDown, ChevronUp } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function OverviewScreen() {
  const { user, logout } = useAuth();
  const [requestingLOA, setRequestingLOA] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [showLOAHistory, setShowLOAHistory] = useState(false);
  const [showBillsDetails, setShowBillsDetails] = useState(false);

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
  
  // Get recent LOA requests from history
  const loaHistory = mockHistory.filter(item => item.type === 'loa').slice(0, 3); // Show last 3 LOA requests


  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Get greeting based on current time
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
              <Text style={styles.greeting}>{getTimeGreeting()}, </Text>
              <Text style={styles.greeting}>{getFirstName(user.fullName)}! </Text>
              <Text style={styles.subtitle}>Welcome to your health portal</Text>
            </View>
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
                  title="Get Cert   "
                  onPress={handleDownloadCertificate}
                  loading={downloadingCert}
                  variant="secondary"
                />
              </View>
            </View>
            
            {/* LOA Request History */}
            {loaHistory.length > 0 && (
              <View style={styles.historySection}>
                <TouchableOpacity 
                  style={styles.historyHeader}
                  onPress={() => setShowLOAHistory(!showLOAHistory)}
                  activeOpacity={0.7}
                >
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.historyTitle}>Recent Requests ({loaHistory.length})</Text>
                  {showLOAHistory ? (
                    <ChevronUp size={16} color="#6B7280" style={styles.chevronIcon} />
                  ) : (
                    <ChevronDown size={16} color="#6B7280" style={styles.chevronIcon} />
                  )}
                </TouchableOpacity>
                
                {showLOAHistory && (
                  <View style={styles.historyContent}>
                    {loaHistory.map((item) => (
                      <View key={item.id} style={styles.historyItem}>
                        <View style={styles.historyInfo}>
                          <Text style={styles.historyItemTitle}>{item.title}</Text>
                          <Text style={styles.historyItemDescription}>{item.description}</Text>
                          <Text style={styles.historyItemDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                        <View style={[
                          styles.historyStatusBadge,
                          item.status === 'Approved' ? styles.approvedBadge : 
                          item.status === 'Pending' ? styles.pendingHistoryBadge : styles.deniedBadge
                        ]}>
                          <Text style={[
                            styles.historyStatusText,
                            item.status === 'Approved' ? styles.approvedText : 
                            item.status === 'Pending' ? styles.pendingHistoryText : styles.deniedText
                          ]}>
                            {item.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Card>

          {/* Bills Payable Section */}
          <Card>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setShowBillsDetails(!showBillsDetails)}
              activeOpacity={0.7}
            >
              <DollarSign size={24} color="#DC2626" />
              <Text style={styles.sectionTitle}>Bills Payable</Text>
              {showBillsDetails ? (
                <ChevronUp size={20} color="#6B7280" style={styles.chevronIcon} />
              ) : (
                <ChevronDown size={20} color="#6B7280" style={styles.chevronIcon} />
              )}
            </TouchableOpacity>
            
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>Your Next Bill</Text>
              <Text style={styles.totalAmount}>${totalAmountDue.toFixed(2)}</Text>
              <Text style={styles.totalAmountSubtext}>*Based on hospital bills minus insurance coverage</Text>
            </View>

            {showBillsDetails && (
              <View style={styles.billsContent}>
                {mockBillsPayable.map((bill) => (
                  <View key={bill.id} style={styles.billItem}>
                    <View style={styles.billInfo}>
                      <Text style={styles.billDescription}>{bill.description}</Text>
                      <View style={styles.billBreakdown}>
                        <Text style={styles.billBreakdownText}>
                          Hospital Bill: ${bill.hospitalBill.toFixed(2)}
                        </Text>
                        <Text style={styles.billBreakdownText}>
                          Insurance Coverage: ${bill.insuranceCoverage.toFixed(2)}
                        </Text>
                        <Text style={styles.billBreakdownHighlight}>
                          You Pay: ${bill.amount.toFixed(2)}
                        </Text>
                      </View>
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
                  * Your next bill shows the amount you need to pay after insurance coverage is applied.
                </Text>
              </View>
            )}
          </Card>

          {/* Placeholder Cards for Future Features removed as requested */}
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
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
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
  totalAmountSubtext: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 4,
    fontStyle: 'italic',
  },
  billsContent: {
    marginTop: 8,
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
    marginBottom: 8,
  },
  billBreakdown: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  billBreakdownText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 2,
  },
  billBreakdownHighlight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 4,
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
    gap: 8,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 6,
  },
  historySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  historyContent: {
    marginTop: 0,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  historyInfo: {
    flex: 1,
    marginRight: 8,
  },
  historyItemTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 1,
  },
  historyItemDescription: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 1,
  },
  historyItemDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  historyStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  approvedBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingHistoryBadge: {
    backgroundColor: '#FEF3C7',
  },
  deniedBadge: {
    backgroundColor: '#FEE2E2',
  },
  historyStatusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  approvedText: {
    color: '#059669',
  },
  pendingHistoryText: {
    color: '#92400E',
  },
  deniedText: {
    color: '#DC2626',
  },
});