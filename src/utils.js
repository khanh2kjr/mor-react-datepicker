import {
  currentDate,
  currentMonth,
  currentYear,
  DATE_MONTH_TYPE,
  FORMAT_FORWARD_SLASH_YYYYMMDD,
} from './constants'

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
  const _minDate =
    format === FORMAT_FORWARD_SLASH_YYYYMMDD
      ? minDate
      : minDate.split('/').reverse().join('/')
  const _maxDate =
    format === FORMAT_FORWARD_SLASH_YYYYMMDD
      ? maxDate
      : maxDate.split('/').reverse().join('/')
  const minDateObject = new Date(_minDate)
  const maxDateObject = new Date(_maxDate)
  const valueDateObject = new Date(
    [
      getPerfectDate(dateValue.year),
      getPerfectDate(dateValue.month),
      getPerfectDate(dateValue.date),
    ].join('/')
  )
  return (
    valueDateObject.getTime() < minDateObject.getTime() ||
    valueDateObject.getTime() > maxDateObject.getTime()
  )
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
  return (
    d.getMonth() === parts[0] &&
    d.getDate() === parts[1] &&
    d.getFullYear() === parts[2]
  )
}

export const getDateOfWeek = (weekNumber, year) => {
  return new Date(year, 0, 1 + weekNumber * 7)
}

export const getValueShoot = (format, { year, month, date }) => {
  const _year = getPerfectDate(year)
  const _month = getPerfectDate(month)
  const _date = getPerfectDate(date)
  const valueDate = [_year, _month, _date]
  return format === FORMAT_FORWARD_SLASH_YYYYMMDD
    ? valueDate.join('/')
    : valueDate.reverse().join('/')
}

// get className
export const getRootDatepickerClassName = (
  hasShowPicker,
  disabled,
  error,
  className
) => {
  let initClassName = 'mor-datepicker'
  if (hasShowPicker) {
    initClassName += ' mor-datepicker-focus'
  }
  if (disabled) {
    initClassName += ' mor-datepicker-disabled'
  }
  if (error) {
    initClassName += ' mor-datepicker-error'
  }
  if (className) {
    initClassName += ` ${className}`
  }
  return initClassName
}

export const getDateClassName = (
  valueGlobal,
  format,
  minDate,
  maxDate,
  dateMonthType,
  { year, month, date }
) => {
  let initClassName = 'mor-date'
  if (dateMonthType !== DATE_MONTH_TYPE.CURRENT_MONTH) {
    initClassName += ' mor-date-old-future'
  }
  const valueDateLocal = getValueShoot(format, { year, month, date })
  const valueDateToday = getValueShoot(format, {
    year: currentYear,
    month: currentMonth,
    date: currentDate,
  })
  if (valueDateLocal === valueGlobal) {
    initClassName += ' mor-date-selected'
  }
  if (valueDateLocal === valueDateToday) {
    initClassName += ' mor-date-today'
  }
  if (setDateDisabled(minDate, maxDate, format, { year, month, date })) {
    initClassName += ' mor-date-disabled'
  }
  return initClassName
}

export const getWeekClassName = (
  week,
  weekData,
  format,
  picker,
  minDate,
  maxDate,
  isShowWeekPicker
) => {
  let initClassName = 'mor-week'
  if (isShowWeekPicker) {
    initClassName += ' mor-week-picker'
  }
  const isWeekPicker = weekData.value && picker === 'week'
  const isWeekSelected =
    week[3].value.year === weekData.year &&
    week[3].value.month === weekData.month &&
    week[3].value.date === weekData.date
  const isWeekValuePropSelected =
    week.findIndex(
      (dateValue) =>
        dateValue.value.date === weekData.date &&
        dateValue.value.month === weekData.month &&
        dateValue.value.year === weekData.year
    ) !== -1
  if (isWeekPicker && (isWeekSelected || isWeekValuePropSelected)) {
    initClassName += ' mor-week-selected'
  }
  if (
    week.findIndex(
      (dateValue) =>
        dateValue.value.year === currentYear &&
        dateValue.value.month === currentMonth &&
        dateValue.value.date === currentDate
    ) !== -1 &&
    picker === 'week'
  ) {
    initClassName += ' mor-week-current'
  }
  if (
    setDateDisabled(minDate, maxDate, format, {
      year: week[0].value.year,
      month: week[0].value.month,
      date: week[0].value.date,
    }) &&
    picker === 'week'
  ) {
    initClassName += ' mor-week-disabled'
  }
  return initClassName
}

// refactor value - validation runtime
export const refactorValuePickerDate = (value, isFormatYYYYMMDD) => {
  const valueSplit = value.split('/')
  const _year = isFormatYYYYMMDD ? valueSplit[0] : valueSplit[2]
  const _month = valueSplit[1]
  const _date = isFormatYYYYMMDD ? valueSplit[2] : valueSplit[0]
  return [_month, _date, _year].join('/')
}

export const refactorValuePickerMonth = (value, isFormatYYYYMMDD) => {
  const _valueArr = [value, '01']
  const _value = isFormatYYYYMMDD
    ? _valueArr.join('/')
    : _valueArr.reverse().join('/')
  return refactorValuePickerDate(_value, isFormatYYYYMMDD)
}

export const refactorValuePickerYear = (value, isFormatYYYYMMDD) => {
  const _valueArr = [value, '01/01']
  const _value = isFormatYYYYMMDD
    ? _valueArr.join('/')
    : _valueArr.reverse().join('/')
  return refactorValuePickerDate(_value, isFormatYYYYMMDD)
}

export const refactorValuePickerWeek = (
  value,
  setWeekData,
  setYear,
  setMonth,
  setDate
) => {
  const dateObjectFromWeek = getDateOfWeek(value[1], value[0])
  const _year = getPerfectDate(dateObjectFromWeek.getFullYear())
  const _month = getPerfectDate(dateObjectFromWeek.getMonth() + 1)
  const _date = getPerfectDate(dateObjectFromWeek.getDate())
  setWeekData({
    value: value[1],
    year: Number(_year),
    month: Number(_month),
    date: Number(_date),
  })
  setYear(Number(_year))
  setMonth(Number(_month))
  setDate(Number(_date))
  return [_month, _date, _year].join('/')
}
