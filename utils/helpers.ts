// Types
interface TruncateWordsFunction {
  (text: string, wordLimit: number): string;
}

interface ToBengaliNumberFunction {
  (str: string | number): string;
}

interface ToBengaliDateFunction {
  (date: string | Date, includeDay?: boolean): string;
}

interface ToBengaliDateShortFunction {
  (date: string | Date): string;
}

// Truncate words function
export const truncateWords: TruncateWordsFunction = (text, wordLimit) => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Convert English numbers to Bengali numbers
export function toBengaliNumber(str: string | number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const stringValue = str.toString();
  return stringValue.replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}

// Bengali day names
const dayNamesBn: string[] = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার',
  'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// Bengali month names
const monthNamesBn: string[] = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export function toBengaliDate(date: string | Date, includeDay: boolean = true): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const dayName = dayNamesBn[d.getDay()];
  const bengaliDay = toBengaliNumber(d.getDate().toString());
  const monthName = monthNamesBn[d.getMonth()];
  const bengaliYear = toBengaliNumber(d.getFullYear().toString());

  if (includeDay) {
    return `${dayName}, ${bengaliDay} ${monthName} ${bengaliYear}`;
  } else {
    return `${bengaliDay} ${monthName} ${bengaliYear}`;
  }
}

// Short Bengali day names
const shortDayNamesBn: string[] = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];

// Short Bengali month names
const shortMonthNamesBn: string[] = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন',
  'জুলা', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'
];

export function toBengaliDateShort(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const dayName = shortDayNamesBn[d.getDay()];
  const bengaliDay = toBengaliNumber(d.getDate().toString());
  const monthName = shortMonthNamesBn[d.getMonth()];
  const bengaliYear = toBengaliNumber(d.getFullYear().toString());

  return `${dayName}, ${bengaliDay} ${monthName} ${bengaliYear}`;
}

export const taka = (amount: number): string => `৳${amount.toFixed(2)}`;