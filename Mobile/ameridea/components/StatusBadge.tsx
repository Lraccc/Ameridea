import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Active' | 'Inactive';
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusStyle = () => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return {
          backgroundColor: '#DCFCE7',
          color: '#059669',
        };
      case 'Pending':
      case 'Processing':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
        };
      case 'Rejected':
      case 'Inactive':
        return {
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#6B7280',
        };
    }
  };

  const statusStyle = getStatusStyle();
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: statusStyle.backgroundColor },
      isSmall && styles.smallBadge
    ]}>
      <Text style={[
        styles.text,
        { color: statusStyle.color },
        isSmall && styles.smallText
      ]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
});