import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { fontSize, spacing } from '../constants/spacing';
import { colors } from '../constants/colors';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(50));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnimation, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Calculate profile completion
    if (user) {
      const fields = [
        user.email,
        user.firstName,
        user.lastName,
        user.phone,
        user.country,
        user.dateOfBirth,
        user.address,
        user.city,
        user.zipCode,
      ];
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            AccessibilityInfo.announceForAccessibility('Logout cancelled');
          },
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            AccessibilityInfo.announceForAccessibility('Logging out...');
            await logout();
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <View 
        style={styles.container}
        accessible={true}
        accessibilityRole="alert"
      >
        <Text 
          style={styles.errorText}
          accessible={true}
          accessibilityLabel="Error: No user data found"
        >
          No user data found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      accessible={true}
      bounces={false}
    >
      <Animated.View
        style={{
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }],
        }}
      >
        {/* Header with Avatar Placeholder */}
        <View 
          style={styles.header}
          accessible={true}
          accessibilityRole="header"
        >
          <View style={styles.avatarContainer}>
            <View 
              style={styles.avatar}
              accessible={true}
              accessibilityLabel={`${user.firstName} ${user.lastName}'s profile avatar`}
            >
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Text>
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <Text 
              style={styles.greeting}
              accessible={true}
              accessibilityRole="text"
            >
              Welcome back! 👋
            </Text>
            <Text 
              style={styles.userName}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`User name: ${user.firstName} ${user.lastName}`}
            >
              {user.firstName} {user.lastName}
            </Text>
          </View>
        </View>

        {/* Profile Information Card */}
        <View 
          style={styles.card}
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel="Profile information section"
        >
          <Text 
            style={styles.cardTitle}
            accessible={true}
            accessibilityRole="header"
          >
            📋 Profile Information
          </Text>

          <InfoRow 
            label="Email" 
            value={user.email} 
            icon="📧"
            accessibilityLabel={`Email address: ${user.email}`}
          />
          <InfoRow 
            label="Phone" 
            value={user.phone} 
            icon="📱"
            accessibilityLabel={`Phone number: ${user.phone}`}
          />
          <InfoRow 
            label="Country" 
            value={user.country} 
            icon="🌍"
            accessibilityLabel={`Country: ${user.country}`}
          />
          <InfoRow 
            label="Address" 
            value={user.address} 
            icon="🏠"
            accessibilityLabel={`Address: ${user.address}`}
          />
          {/* <InfoRow 
            label="City" 
            value={user.city} 
            icon="🏙️"
            accessibilityLabel={`City: ${user.city}`}
          /> */}
        </View>

        {/* Logout Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            accessibilityLabel="Logout button"
            accessibilityHint="Double tap to logout from your account"
            accessibilityRole="button"
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

// Reusable Info Row Component
interface InfoRowProps {
  label: string;
  value: string;
  icon: string;
  isLast?: boolean;
  accessibilityLabel: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon, isLast = false, accessibilityLabel }) => (
  <View
    style={[styles.infoRow, isLast && styles.infoRowLast]}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={accessibilityLabel}
  >
    <View style={styles.infoLabelContainer}>
      <Text style={styles.infoIcon} accessible={false}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(16),
  },
  avatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  verifiedIcon: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: spacing.md,
    marginBottom: verticalScale(24),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: fontSize.lg,
    marginRight: scale(8),
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1.5,
    marginLeft: scale(16),
  },
  // actionsContainer: {
  //   marginBottom: verticalScale(24),
  // },
  // actionsTitle: {
  //   fontSize: fontSize.lg,
  //   fontWeight: 'bold',
  //   color: colors.text,
  //   marginBottom: verticalScale(16),
  // },
  // actionsGrid: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  // },
  // actionButton: {
  //   width: '48%',
  //   backgroundColor: colors.white,
  //   paddingVertical: verticalScale(16),
  //   paddingHorizontal: scale(16),
  //   borderRadius: moderateScale(12),
  //   alignItems: 'center',
  //   marginBottom: verticalScale(12),
  //   shadowColor: colors.black,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // actionIcon: {
  //   fontSize: fontSize.xxxl,
  //   marginBottom: verticalScale(8),
  // },
  // actionText: {
  //   fontSize: fontSize.sm,
  //   color: colors.text,
  //   fontWeight: '600',
  // },
  buttonContainer: {
    marginBottom: verticalScale(16),
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginTop: verticalScale(40),
  },
});