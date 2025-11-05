import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  AccessibilityInfo,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorText } from '../components/ErrorText';
import { useAuthStore } from '../store/authStore';
import { LoginFormData } from '../types';
import { validateEmail, validateRequired } from '../utils/validation';
import { fontSize } from '../constants/spacing';
import { colors } from '../constants/colors';
import { MAX_LOGIN_ATTEMPTS } from '../utils/constants';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));

  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const {
    login,
    isAccountLocked,
    lockTime,
    resetFailedAttempts,
    failedLoginAttempts,
  } = useAuthStore();

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Pulse animation for FOMO elements
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Timer Logic for auto unlock
  useEffect(() => {
    if (!isAccountLocked || !lockTime) return;

    const interval = setInterval(() => {
      const twoMinutes = 2 * 60 * 1000;
      const timePassed = Date.now() - lockTime;
      const timeLeft = Math.max((twoMinutes - timePassed) / 1000, 0);
      setRemainingTime(Math.floor(timeLeft));

      if (timeLeft <= 0) {
        resetFailedAttempts();
        clearInterval(interval);
        // Announce to screen reader
        AccessibilityInfo.announceForAccessibility(
          'Account unlocked. You can try logging in again.',
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAccountLocked, lockTime, resetFailedAttempts]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  // Shake animation on error
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setLoginError('');

      const result = await login(data.emailOrUsername, data.password);

      if (result.success) {
        // Success announcement for screen readers
        AccessibilityInfo.announceForAccessibility(
          'Login successful. Welcome back!',
        );
        navigation.replace('Home');
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
        triggerShake();
        // Error announcement for screen readers
        AccessibilityInfo.announceForAccessibility(
          `Login failed. ${result.error || 'Please check your credentials.'}`,
        );
      }
    } catch {
      const errorMsg = 'An error occurred. Please try again.';
      setLoginError(errorMsg);
      triggerShake();
      AccessibilityInfo.announceForAccessibility(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptsRemaining = MAX_LOGIN_ATTEMPTS - failedLoginAttempts;
  const showWarning = failedLoginAttempts > 0 && !isAccountLocked;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimation,
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {/* FOMO Banner */}
          <Animated.View
            style={[
              styles.fomoBanner,
              { transform: [{ scale: pulseAnimation }] },
            ]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="Join 10,000 plus users already enjoying exclusive features"
            accessibilityHint="Sign up now to get started"
          >
            <Text style={styles.fomoIcon}>🎉</Text>
            <Text style={styles.fomoText}>
              <Text style={styles.fomoBold}>10,000+</Text> users already
              enjoying exclusive features!
            </Text>
          </Animated.View>

          {/* Header */}
          <View style={styles.header}>
            <Text
              style={styles.title}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Welcome Back"
            >
              Welcome Back
            </Text>
            <Text
              style={styles.subtitle}
              accessible={true}
              accessibilityRole="text"
            >
              Sign in to continue your journey
            </Text>
          </View>

          {/* Progress Indicator for Gamification */}
          {showWarning && (
            <View
              style={styles.attemptsContainer}
              accessible={true}
              accessibilityRole="alert"
              accessibilityLabel={`Security alert: ${attemptsRemaining} login ${
                attemptsRemaining === 1 ? 'attempt' : 'attempts'
              } remaining before account lock`}
              accessibilityLiveRegion="polite"
            >
              <View style={styles.attemptsHeader}>
                <Text style={styles.attemptsIcon}>🔐</Text>
                <Text style={styles.attemptsText}>
                  {attemptsRemaining}{' '}
                  {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        (attemptsRemaining / MAX_LOGIN_ATTEMPTS) * 100
                      }%`,
                      backgroundColor:
                        attemptsRemaining <= 2 ? colors.error : colors.warning,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="emailOrUsername"
              rules={{ validate: validateEmail }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <Input
                    ref={emailRef}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.emailOrUsername?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="Enter your email"
                    returnKeyType="next"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ validate: validateRequired }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <Input
                    ref={passwordRef}
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    placeholder="Enter your password"
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setShowPassword(!showPassword);
                          AccessibilityInfo.announceForAccessibility(
                            showPassword
                              ? 'Password hidden'
                              : 'Password visible',
                          );
                        }}
                        activeOpacity={0.7}
                        style={{padding: 0}}
                      >
                        <Text style={styles.eyeIcon}>
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
              )}
            />

            {/* Lock Message with Countdown */}
            {isAccountLocked && (
              <View
                style={styles.lockContainer}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel={`Account locked. Please wait ${formatTime(
                  remainingTime,
                )} minutes before trying again`}
                accessibilityLiveRegion="assertive"
              >
                <Text style={styles.lockIcon}>🔒</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lockTitle}>Account Locked</Text>
                  <Text style={styles.lockMessage}>
                    Too many failed attempts. Try again in{' '}
                    <Text style={styles.lockTime}>
                      {formatTime(remainingTime)}
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            {loginError && !isAccountLocked && (
              <View 
                style={styles.errorContainer}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel={`Error: ${loginError}`}
                accessibilityLiveRegion="assertive"
              >
                <View style={styles.errorIconContainer}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                </View>
                <View style={styles.errorTextContainer}>
                  <Text style={styles.errorTitle}>Login Failed</Text>
                  <Text style={styles.errorMessage}>{loginError}</Text>
                </View>
              </View>
            )}

            {/* Login Button */}
            <Button
              title={isSubmitting ? 'Signing In...' : 'Sign In'}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting || isAccountLocked}
              loading={isSubmitting}
              accessibilityLabel="Sign in button"
              accessibilityHint="Double tap to sign in to your account"
              accessibilityState={{
                disabled: !isValid || isSubmitting || isAccountLocked,
                busy: isSubmitting,
              }}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link with FOMO */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}
              style={styles.registerLink}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Sign up for a new account"
              accessibilityHint="Double tap to create a new account"
            >
              <View style={styles.registerBadge}>
                <Text style={styles.registerBadgeText}>NEW</Text>
              </View>
              <Text style={styles.registerLinkText}>
                Don't have an account?{' '}
                <Text style={styles.registerLinkBold}>Sign Up Now</Text>
              </Text>
              <Text style={styles.registerSubtext}>
                🎁 Get exclusive benefits when you join today!
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  content: {
    width: '100%',
  },
  fomoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  fomoIcon: {
    fontSize: fontSize.xxl,
    marginRight: scale(8),
  },
  fomoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.white,
    lineHeight: fontSize.md * 1.4,
  },
  fomoBold: {
    fontWeight: 'bold',
    fontSize: fontSize.md,
  },
  header: {
    marginBottom: verticalScale(32),
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  attemptsContainer: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  attemptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  attemptsIcon: {
    fontSize: fontSize.lg,
    marginRight: scale(8),
  },
  attemptsText: {
    fontSize: fontSize.md,
    color: '#856404',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: verticalScale(6),
    backgroundColor: '#FFE5A3',
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: moderateScale(3),
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: verticalScale(4),
  },
  eyeIcon: {
    fontSize: fontSize.xl,
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D7DA',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  lockIcon: {
    fontSize: fontSize.xxl,
    marginRight: scale(12),
  },
  lockTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#721C24',
    marginBottom: verticalScale(4),
  },
  lockMessage: {
    fontSize: fontSize.sm,
    color: '#721C24',
    flex: 1,
  },
  lockTime: {
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    color: colors.error,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: verticalScale(16),
    padding: scale(8),
  },
  forgotPasswordText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: scale(16),
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: '#F0F9FF',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    position: 'relative',
  },
  registerBadge: {
    position: 'absolute',
    top: -verticalScale(10),
    backgroundColor: colors.error,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  registerBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.white,
  },
  registerLinkText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  registerLinkBold: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
  registerSubtext: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorIconContainer: {
    marginRight: scale(12),
    marginTop: verticalScale(2),
  },
  errorIcon: {
    fontSize: fontSize.xl,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: verticalScale(4),
  },
  errorMessage: {
    fontSize: fontSize.sm,
    color: '#DC2626',
    lineHeight: fontSize.md * 1.5,
  },
});
