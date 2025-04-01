/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

/**
 * Get a description of the SEO score
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return "Excellent implementation with minor improvements possible";
  if (score >= 80) return "Good implementation with some room for improvement";
  if (score >= 60) return "Adequate implementation but needs improvement";
  if (score >= 40) return "Poor implementation requiring significant improvements";
  return "Critical issues found that need immediate attention";
}

/**
 * Get a color based on a score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}
