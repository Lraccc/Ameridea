import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { mockCoverages } from '@/data/mockData';
import { Coverage } from '@/types/coverage';
import { 
  Shield, 
  Heart, 
  Eye, 
  Pill, 
  Stethoscope,
  Activity 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const getCoverageIcon = (type: Coverage['type']) => {
  const iconProps = { size: 24, color: '#2563EB' };
  
  switch (type) {
    case 'Medical':
      return <Heart {...iconProps} />;
    case 'Dental':
      return <Shield {...iconProps} />;
    case 'Vision':
      return <Eye {...iconProps} />;
    case 'Prescription':
      return <Pill {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

function CoverageCard({ coverage }: { coverage: Coverage }) {
  const usagePercentage = coverage.used / coverage.limit;
  const isHighUsage = usagePercentage > 0.8;
  
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Card style={styles.coverageCard}>
        <View style={styles.coverageHeader}>
          <View style={styles.coverageInfo}>
            {getCoverageIcon(coverage.type)}
            <View style={styles.coverageDetails}>
              <Text style={styles.coverageName}>{coverage.name}</Text>
              <Text style={styles.coverageType}>{coverage.type}</Text>
            </View>
          </View>
          <View style={styles.coverageAmounts}>
            <Text style={styles.remainingAmount}>
              {formatCurrency(coverage.remaining)}
            </Text>
            <Text style={styles.remainingLabel}>Remaining</Text>
          </View>
        </View>
        
        <Text style={styles.coverageDescription}>{coverage.description}</Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.usedLabel}>
              Used: {formatCurrency(coverage.used)}
            </Text>
            <Text style={styles.limitLabel}>
              Limit: {formatCurrency(coverage.limit)}
            </Text>
          </View>
          <ProgressBar 
            progress={usagePercentage}
            color={isHighUsage ? '#DC2626' : '#2563EB'}
            height={8}
          />
          <Text style={[
            styles.usagePercentage,
            isHighUsage && styles.highUsageText
          ]}>
            {Math.round(usagePercentage * 100)}% used
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
export default function CoverageScreen() {
  const medicalCoverages = mockCoverages.filter(c => c.type === 'Medical');
  const otherCoverages = mockCoverages.filter(c => c.type !== 'Medical');
  
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Coverage Details</Text>
          
          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Shield size={32} color="#2563EB" />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>Your Coverage Summary</Text>
                <Text style={styles.summarySubtitle}>
                  {mockCoverages.length} active coverages
                </Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(mockCoverages.reduce((sum, c) => sum + c.remaining, 0))}
                </Text>
                <Text style={styles.statLabel}>Total Remaining</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(mockCoverages.reduce((sum, c) => sum + c.used, 0))}
                </Text>
                <Text style={styles.statLabel}>Total Used</Text>
              </View>
            </View>
          </Card>
          
          {/* Medical Coverages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Coverage</Text>
            {medicalCoverages.map((coverage) => (
              <CoverageCard key={coverage.id} coverage={coverage} />
            ))}
          </View>
          
          {/* Other Coverages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Coverage</Text>
            {otherCoverages.map((coverage) => (
              <CoverageCard key={coverage.id} coverage={coverage} />
            ))}
          </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 20,
  },
  summaryCard: {
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  coverageCard: {
    marginBottom: 12,
  },
  coverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  coverageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coverageDetails: {
    marginLeft: 12,
    flex: 1,
  },
  coverageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  coverageType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  coverageAmounts: {
    alignItems: 'flex-end',
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  remainingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  coverageDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  usedLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  limitLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  usagePercentage: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'right',
  },
  highUsageText: {
    color: '#DC2626',
  },
});