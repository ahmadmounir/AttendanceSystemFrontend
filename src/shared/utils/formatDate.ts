/**
 * Format a date string to a readable format: Day, Month Year
 * Example: "14, Oct 2025" or "05, Oct 2025"
 * 
 * @param dateString - ISO date string or undefined
 * @returns Formatted date string or '-' if no date provided
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Get day, month, and year
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  // Format: day, month year (e.g., "14, Oct 2025" or "05, Oct 2025")
  return `${day}, ${month} ${year}`;
}
