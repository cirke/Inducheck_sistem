/**
 * Number and data formatting utilities
 */

export function formatNumber(num) {
  // Format number with commas (1247 → "1,247")
  return num.toLocaleString('en-US');
}

export function formatDuration(minutes) {
  // Format duration (47 → "47min", 127 → "2h 7min")
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

export function formatCycleTime(seconds) {
  // Format cycle time (4.234 → "4.2s", 0 → "STOP")
  if (seconds === 0) return 'STOP';
  return `${seconds.toFixed(1)}s`;
}

export function formatPercentage(value) {
  // Format percentage (82.3 → "82.3%")
  return `${value}%`;
}

export function getCurrentTime() {
  // Get current time in HH:MM format
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
