import { FORMAT_FORWARD_SLASH_YYYYMMDD } from './constants'

export const getPerfectDate = (date) => {
  return date.toString().length > 1 ? date : `0${date}`
}

export const chunkArray = (arr, chunkSize) => {
  if (chunkSize <= 0) return arr
  const result = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

export const getTotalDateFromYearMonth = (year, month) => {
  const _year = Number(year)
  const _month = Number(month)
  let result = 31
  const monthsWithThirtyFirst = ['1', '3', '5', '7', '8', '10', '12']
  const monthsWithThirty = ['4', '6', '9', '11']
  if (monthsWithThirtyFirst.includes(_month.toString())) {
    result = 31
  } else if (monthsWithThirty.includes(_month.toString())) {
    result = 30
  } else {
    result = new Date(_year, 1, 29).getMonth() === 1 ? 29 : 28
  }
  return result
}

export const formatDateValue = (value, format) => {
  if (format !== FORMAT_FORWARD_SLASH_YYYYMMDD) {
    return value.split('/').reverse().join('/')
  }
  return value
}

export const setDateDisabled = (minDate, maxDate, format, dateValue) => {
  const _minDate = format === FORMAT_FORWARD_SLASH_YYYYMMDD ? minDate : minDate.split('/').reverse().join('/')
  const _maxDate = format === FORMAT_FORWARD_SLASH_YYYYMMDD ? maxDate : maxDate.split('/').reverse().join('/')
  const minDateObject = new Date(_minDate)
  const maxDateObject = new Date(_maxDate)
  const valueDateObject = new Date(
    [getPerfectDate(dateValue.year), getPerfectDate(dateValue.month), getPerfectDate(dateValue.date)].join('/')
  )
  return valueDateObject.getTime() < minDateObject.getTime() || valueDateObject.getTime() > maxDateObject.getTime()
}

export const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return [d.getUTCFullYear(), weekNo]
}

export const getOrdinalSuffixOf = (i) => {
  const j = i % 10,
    k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export const isValidDate = (s) => {
  // Assumes s is "mm/dd/yyyy"
  if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(s)) {
    return false
  }
  const parts = s.split('/').map((p) => parseInt(p, 10))
  parts[0] -= 1
  const d = new Date(parts[2], parts[0], parts[1])
  return d.getMonth() === parts[0] && d.getDate() === parts[1] && d.getFullYear() === parts[2]
}
