export const MIN_YEAR = 1600
export const MAX_YEAR = 9999

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const CENTURY_ANCHORS = [2, 0, 5, 3] as const
const MONTHLY_ANCHORS = [
  { common: 3, leap: 4 },
  { common: 28, leap: 29 },
  { common: 14, leap: 14 },
  { common: 4, leap: 4 },
  { common: 9, leap: 9 },
  { common: 6, leap: 6 },
  { common: 11, leap: 11 },
  { common: 8, leap: 8 },
  { common: 5, leap: 5 },
  { common: 10, leap: 10 },
  { common: 7, leap: 7 },
  { common: 12, leap: 12 },
] as const

export interface DoomsdayCalculation {
  year: number
  month: number
  day: number
  leapYear: boolean
  century: number
  centuryAnchorIndex: number
  yearSuffix: number
  firstOddAdjustmentApplied: boolean
  afterFirstOddAdjustment: number
  firstHalf: number
  secondOddAdjustmentApplied: boolean
  afterSecondOddAdjustment: number
  odd11Remainder: number
  yearOffset: number
  doomsdayIndex: number
  monthlyAnchor: number
  delta: number
  dateWeekdayIndex: number
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(month) || month < 1 || month > 12) return 0
  if (month === 2) return isLeapYear(year) ? 29 : 28
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

export function normalizeWeekday(index: number): number {
  return ((index % 7) + 7) % 7
}

export function calculateDoomsday(
  year: number,
  month: number,
  day: number,
): DoomsdayCalculation {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    throw new RangeError(`Enter a whole year from ${MIN_YEAR} to ${MAX_YEAR}.`)
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Choose a month from January to December.')
  }
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError('That day does not exist in the selected month.')
  }

  const leapYear = isLeapYear(year)
  const century = Math.floor(year / 100) * 100
  const centuryAnchorIndex = CENTURY_ANCHORS[(Math.floor(year / 100) % 4)]!
  const yearSuffix = year % 100
  const firstOddAdjustmentApplied = yearSuffix % 2 !== 0
  const afterFirstOddAdjustment = yearSuffix + (firstOddAdjustmentApplied ? 11 : 0)
  const firstHalf = afterFirstOddAdjustment / 2
  const secondOddAdjustmentApplied = firstHalf % 2 !== 0
  const afterSecondOddAdjustment = firstHalf + (secondOddAdjustmentApplied ? 11 : 0)
  const odd11Remainder = afterSecondOddAdjustment % 7
  const yearOffset = 7 - odd11Remainder
  const doomsdayIndex = normalizeWeekday(centuryAnchorIndex + yearOffset)
  const monthAnchor = MONTHLY_ANCHORS[month - 1]!
  const monthlyAnchor = leapYear ? monthAnchor.leap : monthAnchor.common
  const delta = day - monthlyAnchor

  return {
    year,
    month,
    day,
    leapYear,
    century,
    centuryAnchorIndex,
    yearSuffix,
    firstOddAdjustmentApplied,
    afterFirstOddAdjustment,
    firstHalf,
    secondOddAdjustmentApplied,
    afterSecondOddAdjustment,
    odd11Remainder,
    yearOffset,
    doomsdayIndex,
    monthlyAnchor,
    delta,
    dateWeekdayIndex: normalizeWeekday(doomsdayIndex + delta),
  }
}
