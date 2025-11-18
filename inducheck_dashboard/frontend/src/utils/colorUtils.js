/**
 * Color coding utilities for machine status
 * Returns colors and emojis based on machine status
 */

export function getStatusColor(status) {
  switch (status) {
    case 'running':
      return '#22c55e';  // Green
    case 'stopped':
      return '#ef4444';  // Red
    case 'warning':
      return '#f59e0b';  // Yellow
    case 'offline':
      return '#9ca3af';  // Gray
    default:
      return '#6b7280';  // Default gray
  }
}

export function getStatusBackground(status) {
  switch (status) {
    case 'running':
      return '#f0fdf4';  // Light green
    case 'stopped':
      return '#fef2f2';  // Light red
    case 'warning':
      return '#fffbeb';  // Light yellow
    case 'offline':
      return '#f9fafb';  // Light gray
    default:
      return '#ffffff';  // White
  }
}

export function getStatusEmoji(status) {
  switch (status) {
    case 'running':
      return '🟢';
    case 'stopped':
      return '🔴';
    case 'warning':
      return '🟡';
    case 'offline':
      return '⚪';
    default:
      return '⚫';
  }
}

export function shouldBlink(status) {
  // Only stopped machines should blink
  return status === 'stopped';
}

export function getOEEBadgeClass(oee) {
  if (oee >= 85) return 'oee-badge good';
  if (oee >= 75) return 'oee-badge medium';
  return 'oee-badge poor';
}
