import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  AccessibilityInfo,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ErrorText } from "../components/ErrorText";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateRequired,
} from "../utils/validation";
import { useAuthStore } from "../store/authStore";
import { RegistrationFormData } from "../types";
import { colors } from "../constants/colors";
import { fontSize } from "../constants/spacing";
import { DropdownPicker } from "../components/DropdownPicker";
import countriesData from '../data/countries.json';

export const RegistrationScreen = ({ navigation }: any) => {
  const { register } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Create refs for each input
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  
  const countries = countriesData.map((country) => ({
    label: country.name,
    value: country.code,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegistrationFormData>({
    mode: "onChange",
    defaultValues: {},
  });

  const password = watch("password");

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const { password: pwd, confirmPassword, ...userData } = data;
      const success = await register(userData, pwd);

      if (success) {
        AccessibilityInfo.announceForAccessibility("Account created successfully");
        navigation.replace("Home");
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    } catch (err) {
      setSubmitError("Something went wrong, try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Your Account</Text>
  
        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{ validate: validateEmail }}
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              ref={emailRef}
              label="Email Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              placeholder="example@email.com"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          )}
        />
  
        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{ validate: validatePassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={passwordRef}
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!showPassword}
              rightIcon={<Text style={styles.eye}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              placeholder="Min. 8 characters"
              autoComplete="password"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
          )}
        />
  
        {/* Password Strength */}
        {/* {password?.length > 0 && (
          <View style={styles.strengthWrap}>
            <Text style={styles.strengthLabel}>Password Strength:</Text>
            <View style={styles.strengthBars}>
              <View style={[styles.bar, password.length >= 8 && styles.active]} />
              <View style={[styles.bar, /[A-Z]/.test(password) && styles.active]} />
              <View style={[styles.bar, /[0-9]/.test(password) && styles.active]} />
              <View style={[styles.bar, /[@$!%*?&]/.test(password) && styles.active]} />
            </View>
          </View>
        )} */}
  
        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ validate: (v) => validateConfirmPassword(password, v) }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={confirmPasswordRef}
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!showPassword}
              error={errors.confirmPassword?.message}
              placeholder="Re-enter password"
              returnKeyType="next"
              onSubmitEditing={() => firstNameRef.current?.focus()}
            />
          )}
        />
  
        {/* First Name */}
        <Controller
          control={control}
          name="firstName"
          rules={{ validate: validateName }}
          render={({ field }) => (
            <Input
              ref={firstNameRef}
              label="First Name"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.firstName?.message}
              placeholder="John"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          )}
        />
  
        {/* Last Name */}
        <Controller
          control={control}
          name="lastName"
          rules={{ validate: validateName }}
          render={({ field }) => (
            <Input
              ref={lastNameRef}
              label="Last Name"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.lastName?.message}
              placeholder="Doe"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          )}
        />
  
        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          rules={{ validate: validatePhone }}
          render={({ field }) => (
            <Input
              ref={phoneRef}
              label="Phone Number"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="phone-pad"
              error={errors.phone?.message}
              placeholder="+1 123-456-7890"
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          rules={{ validate: validateRequired }}
          render={({ field: { onChange, value } }) => (
            <DropdownPicker
              label="Country"
              value={value}
              items={countries}
              onValueChange={onChange}
              error={errors.country?.message}
              required
              placeholder="Select your country"
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          rules={{ validate: validateRequired }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={addressRef}
              label="Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.message}
              required
              placeholder="Enter your address"
              multiline
              numberOfLines={2}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />
  
        <ErrorText message={submitError} />
        <View style={{ height: 20 }} />
  
        <Button title="Create Account" disabled={!isValid} onPress={handleSubmit(onSubmit)} />
  
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginWrap}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: fontSize.xxxl, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  eye: { fontSize: 22 },
  strengthWrap: { marginVertical: 10 },
  strengthLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 6 },
  strengthBars: { flexDirection: "row", gap: 6 },
  bar: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 4 },
  active: { backgroundColor: colors.success },
  loginWrap: { marginTop: 16, alignItems: "center" },
  loginText: { color: colors.textSecondary, fontSize: fontSize.md },
  loginBold: { color: colors.primary, fontWeight: "700" },
});
