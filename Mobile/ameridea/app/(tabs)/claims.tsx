import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import { mockClaims } from '@/data/mockData';
import { Claim } from '@/types/claims';
import { FileText, Calendar, DollarSign, Building, X, ListFilter as Filter, MessageCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('PHP', '₱');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function ClaimCard({ claim, onPress }: { claim: Claim; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.claimCard}>
        <View style={styles.claimHeader}>
          <View style={styles.claimInfo}>
            <Text style={styles.claimNumber}>{claim.claimNumber}</Text>
            <Text style={styles.claimService}>{claim.service}</Text>
          </View>
          <StatusBadge status={claim.status} size="small" />
        </View>
        
        <View style={styles.claimDetails}>
          <View style={styles.claimDetailItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.claimDetailText}>{formatDate(claim.date)}</Text>
          </View>
          <View style={styles.claimDetailItem}>
            <Building size={16} color="#6B7280" />
            <Text style={styles.claimDetailText}>{claim.provider}</Text>
          </View>
          <View style={styles.claimDetailItem}>
            {/* Peso sign icon for PH currency */}
            <Text style={{fontSize: 16, color: '#6B7280', fontWeight: 'bold', marginRight: 2}}>₱</Text>
            <Text style={styles.claimDetailText}>{formatCurrency(claim.amount)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function ClaimDetailModal({ 
  claim, 
  visible, 
  onClose 
}: { 
  claim: Claim | null; 
  visible: boolean; 
  onClose: () => void; 
}) {
  if (!claim) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Claim Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Card>
            <View style={styles.modalClaimHeader}>
              <Text style={styles.modalClaimNumber}>{claim.claimNumber}</Text>
              <StatusBadge status={claim.status} />
            </View>
            
            <View style={styles.modalDetailSection}>
              <Text style={styles.modalSectionTitle}>Service Information</Text>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Service:</Text>
                <Text style={styles.modalDetailValue}>{claim.service}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Provider:</Text>
                <Text style={styles.modalDetailValue}>{claim.provider}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Amount:</Text>
                <Text style={styles.modalDetailValue}>{formatCurrency(claim.amount)}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Service Date:</Text>
                <Text style={styles.modalDetailValue}>{formatDate(claim.date)}</Text>
              </View>
            </View>
            
            <View style={styles.modalDetailSection}>
              <Text style={styles.modalSectionTitle}>Processing Information</Text>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Submitted:</Text>
                <Text style={styles.modalDetailValue}>{formatDate(claim.submittedDate)}</Text>
              </View>
              {claim.processedDate && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Processed:</Text>
                  <Text style={styles.modalDetailValue}>{formatDate(claim.processedDate)}</Text>
                </View>
              )}
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Status:</Text>
                <Text style={styles.modalDetailValue}>{claim.status}</Text>
              </View>
            </View>
            
            <View style={styles.modalDetailSection}>
              <Text style={styles.modalSectionTitle}>Description</Text>
              <Text style={styles.modalDescription}>{claim.description}</Text>
            </View>
            
            <View style={styles.modalActionSection}>
              <Button
                title="Contact Claim Support"
                onPress={() => {
                  Alert.alert(
                    'Contact Support',
                    `A support conversation has been created for claim ${claim.claimNumber}. You will be redirected to messages.`,
                    [
                      { 
                        text: 'OK', 
                        onPress: () => {
                          onClose();
                          router.push('/(tabs)/messages');
                        }
                      }
                    ]
                  );
                }}
                variant="primary"
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function ClaimsScreen() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Processing'];
  
  const filteredClaims = statusFilter === 'All' 
    ? mockClaims 
    : mockClaims.filter(claim => claim.status === statusFilter);
    
  const handleClaimPress = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedClaim(null);
  };
  
  const getStatusCounts = () => {
    return {
      total: mockClaims.length,
      pending: mockClaims.filter(c => c.status === 'Pending').length,
      approved: mockClaims.filter(c => c.status === 'Approved').length,
      rejected: mockClaims.filter(c => c.status === 'Rejected').length,
    };
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Claims Management</Text>
          
          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <FileText size={32} color="#2563EB" />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>Claims Overview</Text>
                <Text style={styles.summarySubtitle}>
                  {statusCounts.total} total claims
                </Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{statusCounts.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{statusCounts.approved}</Text>
                <Text style={styles.statLabel}>Approved</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{statusCounts.rejected}</Text>
                <Text style={styles.statLabel}>Rejected</Text>
              </View>
            </View>
          </Card>
          
          {/* Filter Section */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Filter size={20} color="#6B7280" />
              <Text style={styles.filterTitle}>Filter by Status</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    statusFilter === status && styles.activeFilterButton
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    statusFilter === status && styles.activeFilterButtonText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Claims List */}
          <View style={styles.claimsSection}>
            <Text style={styles.sectionTitle}>
              {statusFilter === 'All' ? 'All Claims' : `${statusFilter} Claims`}
              {filteredClaims.length > 0 && ` (${filteredClaims.length})`}
            </Text>
            
            {filteredClaims.length === 0 ? (
              <Card style={styles.emptyState}>
                <FileText size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No Claims Found</Text>
                <Text style={styles.emptyStateText}>
                  {statusFilter === 'All' 
                    ? 'You have no claims to display.' 
                    : `No ${statusFilter.toLowerCase()} claims found.`}
                </Text>
              </Card>
            ) : (
              filteredClaims.map((claim) => (
                <ClaimCard 
                  key={claim.id} 
                  claim={claim} 
                  onPress={() => handleClaimPress(claim)}
                />
              ))
            )}
          </View>
        </ScrollView>
        
        <ClaimDetailModal
          claim={selectedClaim}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 20,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  claimsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  claimCard: {
    marginBottom: 12,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  claimInfo: {
    flex: 1,
  },
  claimNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  claimService: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  claimDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  claimDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalClaimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalClaimNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalDetailSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalDetailValue: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalActionSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});