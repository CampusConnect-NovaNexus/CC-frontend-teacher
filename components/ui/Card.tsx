import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View, 
  ViewProps 
} from 'react-native';
import { ThemedView, ThemedViewProps } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { borderRadius, spacing } from '@/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

// Card Container
export interface CardProps extends ThemedViewProps {
  onPress?: () => void;
  pressable?: boolean;
}

export function Card({ 
  children, 
  style, 
  onPress, 
  pressable = !!onPress,
  elevation = 'sm',
  surface = 'card',
  ...rest 
}: CardProps) {
  const Container = pressable ? TouchableOpacity : ThemedView;
  const containerProps = pressable ? { onPress, activeOpacity: 0.7 } : {};
  
  return (
    <ThemedView
      surface={surface}
      elevation={elevation}
      style={[styles.card, style]}
      {...rest}
    >
      <Container {...containerProps} style={styles.innerContainer}>
        {children}
      </Container>
    </ThemedView>
  );
}

// Card Header
export interface CardHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function CardHeader({ title, subtitle, rightElement, style, ...rest }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]} {...rest}>
      <View style={styles.headerTextContainer}>
        <ThemedText variant="headingMedium">{title}</ThemedText>
        {subtitle && (
          <ThemedText variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
}

// Card Content
export interface CardContentProps extends ViewProps {}

export function CardContent({ children, style, ...rest }: CardContentProps) {
  return (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );
}

// Card Footer
export interface CardFooterProps extends ViewProps {}

export function CardFooter({ children, style, ...rest }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]} {...rest}>
      {children}
    </View>
  );
}

// Card Action
export interface CardActionProps extends TouchableOpacityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function CardAction({ icon, label, style, ...rest }: CardActionProps) {
  const iconColor = useThemeColor({}, 'primary');
  
  return (
    <TouchableOpacity style={[styles.action, style]} activeOpacity={0.7} {...rest}>
      {icon && <Ionicons name={icon} size={18} color={iconColor} style={styles.actionIcon} />}
      <ThemedText variant="labelMedium" style={{ color: iconColor }}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Card Divider
export function CardDivider() {
  const dividerColor = useThemeColor({}, 'divider');
  return <View style={[styles.divider, { backgroundColor: dividerColor }]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  content: {
    padding: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionIcon: {
    marginRight: spacing.xs,
  },
});