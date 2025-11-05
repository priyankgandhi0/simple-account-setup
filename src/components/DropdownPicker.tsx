import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../constants/colors';
import { fontSize, spacing } from '../constants/spacing';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownPickerProps {
  label: string;
  value: string;
  items: DropdownItem[];
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  label,
  value,
  items,
  onValueChange,
  error,
  required = false,
  placeholder = 'Select an option',
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${selectedItem?.label || placeholder}`}
        accessibilityHint="Double tap to open dropdown"
      >
        <Text
          style={[
            styles.selectorText,
            !selectedItem && styles.placeholderText,
          ]}
        >
          {selectedItem?.label || placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    item.value === value && styles.listItemSelected,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: item.value === value }}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      item.value === value && styles.listItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  required: {
    color: colors.error,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.white,
  },
  selectorError: {
    borderColor: colors.error,
  },
  selectorText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: verticalScale(4),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    fontSize: fontSize.xl,
    color: colors.textSecondary,
  },
  listItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemSelected: {
    backgroundColor: colors.backgroundSecondary,
  },
  listItemText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  listItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});