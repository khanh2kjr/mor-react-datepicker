const currentDateObject = new Date()
export const currentYear = currentDateObject.getFullYear()
export const currentMonth = currentDateObject.getMonth() + 1
export const currentDate = currentDateObject.getDate()

export const FORMAT_FORWARD_SLASH_YYYYMMDD = 'YYYY/MM/DD'

export const DATE_MONTH_TYPE = {
  OLD_MONTH: 'OLD_MONTH',
  CURRENT_MONTH: 'CURRENT_MONTH',
  FUTURE_MONTH: 'FUTURE_MONTH',
}

export const MATRIX_CALENDAR_TOTAL = 42

export const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
