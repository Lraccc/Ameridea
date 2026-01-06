import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Dimensions, Modal, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { HistoryItem } from '@/components/HistoryItem';
import { Button } from '@/components/Button';
import { mockHistory } from '@/data/mockData';
import { authService } from '@/services/auth.service';
import { 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  History, 
  Shield,
  Mail,
  Calendar,
  ChevronRight,
  Camera,
  Lock,
  Edit,
  X,
  DollarSign,
  Eye,
  EyeOff
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
  const { user, logout, updateUser } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const adIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Profile picture state
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePicture || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Email update modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  
  // Password update modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading states
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Refresh control
  const [refreshing, setRefreshing] = useState(false);

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

  // Load profile picture when user changes
  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImage(user.profilePicture);
    }
  }, [user?.profilePicture]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch latest user data from the server
      const userData = await authService.getCurrentUser();
      
      // Update auth context with fresh data
      if (updateUser) {
        updateUser(userData);
      }
      
      // Update local profile image state
      if (userData.profilePicture) {
        setProfileImage(userData.profilePicture);
      }
    } catch (error: any) {
      console.error('Refresh error:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

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
  
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Get base64 for uploading
    });
    
    if (!result.canceled && result.assets[0].base64) {
      setIsUploadingImage(true);
      try {
        // Create data URI for storage
        const imageData = `data:image/jpeg;base64,${result.assets[0].base64}`;
        
        // Upload to backend
        const response = await authService.updateProfilePicture(imageData);
        
        // Update local state
        setProfileImage(imageData);
        
        // Update auth context with new user data
        if (updateUser) {
          updateUser(response.user);
        }
        
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error: any) {
        console.error('Upload error:', error);
        Alert.alert('Error', error.message || 'Failed to upload profile picture');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };
  
  const handleUpdateEmail = async () => {
    if (!newEmail || !confirmEmail) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (newEmail !== confirmEmail) {
      Alert.alert('Error', 'Emails do not match');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsUpdatingEmail(true);
    try {
      await authService.updateEmail(newEmail);
      Alert.alert('Success', 'Email updated successfully!');
      setShowEmailModal(false);
      setNewEmail('');
      setConfirmEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Reset visibility states
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
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
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2563EB"
              colors={['#2563EB']}
              title="Pull to refresh"
              titleColor="#6B7280"
            />
          }
        >
          <Text style={styles.title}>Settings & Profile</Text>
          
          {/* User Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {/* Show 'Tap to update' only if no profile image is set */}
                {!profileImage && (
                  <Text style={styles.avatarHelperText}>Tap to update</Text>
                )}
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <User size={32} color="#2563EB" />
                )}
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={handlePickImage}
                  accessibilityLabel="Update profile picture"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Camera size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.fullName}</Text>
                <View style={styles.emailRow}>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
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
              <Text style={styles.settingsTitle}>More Settings</Text>
            </View>
            <View style={styles.settingsOptions}>
              <TouchableOpacity 
                style={styles.settingsOption}
                onPress={() => setShowPasswordModal(true)}
              >
                <View style={styles.settingsOptionLeft}>
                  <Lock size={20} color="#6B7280" />
                  <Text style={styles.settingsOptionText}>Change Password</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.settingsOption}
                onPress={() => setShowEmailModal(true)}
              >
                <View style={styles.settingsOptionLeft}>
                  <Mail size={20} color="#6B7280" />
                  <Text style={styles.settingsOptionText}>Update Email</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Billing Section */}
          <Card>
            <View style={styles.settingsHeader}>
              <DollarSign size={24} color="#2563EB" />
              <Text style={styles.settingsTitle}>Billing</Text>
            </View>
            <View style={styles.settingsOptions}>
              <TouchableOpacity style={styles.settingsOption}>
                <View style={styles.settingsOptionLeft}>
                  <Text style={styles.settingsOptionText}>Payment Method</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsOption}>
                <View style={styles.settingsOptionLeft}>
                  <Text style={styles.settingsOptionText}>Billing History</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
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
        
        
        {/* Password Update Modal */}
        <Modal
          visible={showPasswordModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={!showCurrentPassword}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} color="#6B7280" />
                      ) : (
                        <Eye size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} color="#6B7280" />
                      ) : (
                        <Eye size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.inputHint}>Password must be at least 6 characters</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="#6B7280" />
                      ) : (
                        <Eye size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowPasswordModal(false)}
                    disabled={isUpdatingPassword}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton, isUpdatingPassword && styles.disabledButton]}
                    onPress={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Update</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Email Update Modal */}
        <Modal
          visible={showEmailModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEmailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Email</Text>
                <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>New Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new email"
                    value={confirmEmail}
                    onChangeText={setConfirmEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEmailModal(false)}
                    disabled={isUpdatingEmail}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton, isUpdatingEmail && styles.disabledButton]}
                    onPress={handleUpdateEmail}
                    disabled={isUpdatingEmail}
                  >
                    {isUpdatingEmail ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Update</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  avatarHelperText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
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
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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