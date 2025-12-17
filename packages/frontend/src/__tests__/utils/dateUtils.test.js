import { 
  formatDate, 
  formatDateForInput, 
  isPastDate, 
  isToday, 
  getRelativeDateDescription,
  isValidDate 
} from '../../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    test('formats date string to readable format', () => {
      expect(formatDate('2025-12-25')).toBe('Dec 25, 2025');
      expect(formatDate('2025-01-01')).toBe('Jan 1, 2025');
    });

    test('returns "No due date" for null or undefined', () => {
      expect(formatDate(null)).toBe('No due date');
      expect(formatDate(undefined)).toBe('No due date');
      expect(formatDate('')).toBe('No due date');
    });
  });

  describe('formatDateForInput', () => {
    test('formats date for input field (YYYY-MM-DD)', () => {
      expect(formatDateForInput('2025-12-25')).toBe('2025-12-25');
    });

    test('returns empty string for null or undefined', () => {
      expect(formatDateForInput(null)).toBe('');
      expect(formatDateForInput(undefined)).toBe('');
      expect(formatDateForInput('')).toBe('');
    });
  });

  describe('isPastDate', () => {
    test('returns true for past dates', () => {
      const pastDate = '2020-01-01';
      expect(isPastDate(pastDate)).toBe(true);
    });

    test('returns false for future dates', () => {
      const futureDate = '2030-12-31';
      expect(isPastDate(futureDate)).toBe(false);
    });

    test('returns false for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isPastDate(today)).toBe(false);
    });

    test('returns false for null or empty date', () => {
      expect(isPastDate(null)).toBe(false);
      expect(isPastDate('')).toBe(false);
    });
  });

  describe('isToday', () => {
    test('returns true for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isToday(today)).toBe(true);
    });

    test('returns false for other dates', () => {
      expect(isToday('2020-01-01')).toBe(false);
      expect(isToday('2030-12-31')).toBe(false);
    });

    test('returns false for null or empty date', () => {
      expect(isToday(null)).toBe(false);
      expect(isToday('')).toBe(false);
    });
  });

  describe('getRelativeDateDescription', () => {
    test('returns "Today" for today\'s date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(getRelativeDateDescription(today)).toBe('Today');
    });

    test('returns "Tomorrow" for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      expect(getRelativeDateDescription(tomorrowStr)).toBe('Tomorrow');
    });

    test('returns "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      expect(getRelativeDateDescription(yesterdayStr)).toBe('Yesterday');
    });

    test('returns "In X days" for near future dates', () => {
      const inThreeDays = new Date();
      inThreeDays.setDate(inThreeDays.getDate() + 3);
      const dateStr = inThreeDays.toISOString().split('T')[0];
      expect(getRelativeDateDescription(dateStr)).toBe('In 3 days');
    });

    test('returns "X days overdue" for past dates', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const dateStr = threeDaysAgo.toISOString().split('T')[0];
      expect(getRelativeDateDescription(dateStr)).toBe('3 days overdue');
    });

    test('returns "No due date" for null or empty', () => {
      expect(getRelativeDateDescription(null)).toBe('No due date');
      expect(getRelativeDateDescription('')).toBe('No due date');
    });
  });

  describe('isValidDate', () => {
    test('returns true for valid dates', () => {
      expect(isValidDate('2025-12-25')).toBe(true);
      expect(isValidDate('2020-01-01')).toBe(true);
    });

    test('returns false for invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2025-13-45')).toBe(false);
    });

    test('returns true for empty date (optional)', () => {
      expect(isValidDate(null)).toBe(true);
      expect(isValidDate('')).toBe(true);
    });
  });
});
