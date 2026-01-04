import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HistoryItem as HistoryItemType } from '@/types/history';
import { FileText, MessageCircle, Download, Shield } from 'lucide-react-native';

interface HistoryItemProps {
  item: HistoryItemType;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const getIcon = () => {
    const iconProps = { size: 20, color: '#6B7280' };
    
    switch (item.type) {
      case 'claim':
        return <FileText {...iconProps} />;
      case 'loa':
        return <Shield {...iconProps} />;
      case 'certificate':
        return <Download {...iconProps} />;
      case 'message':
        return <MessageCircle {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'Approved':
      case 'Completed':
      case 'Resolved':
        return '#059669';
      case 'Rejected':
        return '#DC2626';
      case 'Pending':
        return '#D97706';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          {item.status && (
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {item.status}
            </Text>
          )}
          {item.amount && (
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});