import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { HistoryItem } from '@/components/HistoryItem';
import { Button } from '@/components/Button';
import { mockHistory } from '@/data/mockData';
import { 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  History, 
  Shield,
  Mail,
  Calendar,
  ChevronRight 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Advertisement images for slideshow
const advertisementImages = [
  'https://via.placeholder.com/400x200/2563EB/FFFFFF?text=Health+Insurance+Benefits',
  'https://via.placeholder.com/400x200/059669/FFFFFF?text=Get+Your+Annual+Checkup',
  'https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Emergency+Coverage+24%2F7',
];

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const adIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Slideshow effect
  useEffect(() => {
    adIntervalRef.current = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisementImages.length);
    }, 5000); // Change ad every 5 seconds

    return () => {
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Settings & Profile</Text>
          
          {/* User Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <User size={32} color="#2563EB" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.fullName}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.profileDetails}>
              <View style={styles.profileDetailRow}>
                <View style={styles.profileDetailItem}>
                  <Shield size={16} color="#6B7280" />
                  <Text style={styles.profileDetailLabel}>Policy Number</Text>
                </View>
                <Text style={styles.profileDetailValue}>{user.policyNumber}</Text>
              </View>
              
              <View style={styles.profileDetailRow}>
                <View style={styles.profileDetailItem}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.profileDetailLabel}>Date of Birth</Text>
                </View>
                <Text style={styles.profileDetailValue}>{formatDate(user.dateOfBirth)}</Text>
              </View>
              
              <View style={styles.profileDetailRow}>
                <View style={styles.profileDetailItem}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.profileDetailLabel}>Status</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{user.policyStatus}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* History Section */}
          <Card>
            <TouchableOpacity 
              style={styles.historyHeader}
              onPress={() => setShowHistory(!showHistory)}
            >
              <View style={styles.historyHeaderContent}>
                <History size={24} color="#2563EB" />
                <Text style={styles.historyTitle}>Activity History</Text>
              </View>
              <ChevronRight 
                size={20} 
                color="#6B7280" 
                style={[
                  styles.chevron,
                  showHistory && styles.chevronRotated
                ]}
              />
            </TouchableOpacity>
            
            {showHistory && (
              <View style={styles.historyContent}>
                <Text style={styles.historySubtitle}>
                  Recent activity and transactions
                </Text>
                {mockHistory.slice(0, 5).map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All History</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          {/* Settings Options */}
          <Card>
            <View style={styles.settingsHeader}>
              <SettingsIcon size={24} color="#2563EB" />
              <Text style={styles.settingsTitle}>Account Settings</Text>
            </View>
            
            <View style={styles.settingsOptions}>
              <TouchableOpacity style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Notification Preferences</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Privacy Settings</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Security</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Help & Support</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.settingsNote}>
              These settings will be available in the final version of the app.
            </Text>
          </Card>

          {/* Advertisement Slideshow */}
          <Card style={styles.adCard}>
            <View style={styles.adContainer}>
              <Image
                source={{ uri: advertisementImages[currentAdIndex] }}
                style={styles.adImage}
                resizeMode="cover"
              />
              <View style={styles.adIndicators}>
                {advertisementImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.adIndicator,
                      index === currentAdIndex && styles.adIndicatorActive
                    ]}
                  />
                ))}
              </View>
            </View>
          </Card>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="secondary"
            />
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
  profileCard: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  profileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  profileDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  historyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  historyContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  historySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  settingsOptions: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  settingsNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  adCard: {
    marginTop: 20,
    padding: 0,
    overflow: 'hidden',
  },
  adContainer: {
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  adIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  adIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  logoutContainer: {
    marginTop: 20,
  },
});