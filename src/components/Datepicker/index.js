import React, { useState, useMemo, useRef, Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import MonthPicker from '../MonthPicker'
import YearPicker from '../YearPicker'
import CalendarIcon from '../CalendarIcon'
import {
  DATE_MONTH_TYPE,
  MATRIX_CALENDAR_TOTAL,
  currentYear,
  currentMonth,
  currentDate,
  FORMAT_FORWARD_SLASH_YYYYMMDD,
  DAY_LABELS,
  MONTH_LABELS,
} from '../../constants'
import { useClickOutside } from '../../hooks'
import {
  chunkArray,
  formatDateValue,
  getOrdinalSuffixOf,
  getPerfectDate,
  getTotalDateFromYearMonth,
  getWeekNumber,
  setDateDisabled,
  isValidDate,
  getDateOfWeek,
  getValueShoot,
  getRootDatepickerClassName,
  getDateClassName,
  getWeekClassName,
  refactorValuePickerDate,
  refactorValuePickerMonth,
  refactorValuePickerYear,
  refactorValuePickerWeek,
} from '../../utils'
import './style.css'

const Datepicker = (props) => {
  const {
    value,
    picker,
    disabled,
    format,
    placeholder,
    className,
    sx,
    onChange,
    onError,
  } = props

  const [year, setYear] = useState(
    value && picker !== 'week'
      ? new Date(formatDateValue(value, format)).getFullYear()
      : currentYear
  )
  const [month, setMonth] = useState(
    value && picker !== 'week'
      ? new Date(formatDateValue(value, format)).getMonth() + 1
      : currentMonth
  )
  const [date, setDate] = useState(
    value && picker !== 'week'
      ? new Date(formatDateValue(value, format)).getDate()
      : currentDate
  )
  const [isShowDatepicker, setIsShowDatepicker] = useState(picker === 'date')
  const [isShowYearPicker, setIsShowYearPicker] = useState(picker === 'year')
  const [isShowWeekPicker, setIsShowWeekPicker] = useState(picker === 'week')
  const [isShowMonthPicker, setIsShowMonthPicker] = useState(picker === 'month')
  const [valueHover, setValueHover] = useState('')
  const [hasShowPicker, setHasShowPicker] = useState(false)
  const [weekData, setWeekData] = useState({
    value: picker === 'week' && value.length ? value[1] : null,
    date,
    month,
    year,
  })
  const [weekDataHover, setWeekDataHover] = useState({
    value: null,
    date,
    month,
    year,
  })
  const [error, setError] = useState(false)

  const morDatepickerRef = useRef()
  const morPickerContainerRef = useRef()

  useClickOutside(morDatepickerRef, () => {
    setHasShowPicker(false)
  })

  const valueView = useMemo(() => {
    if (valueHover || weekDataHover.value) {
      return weekDataHover.value
        ? [weekDataHover.year, getOrdinalSuffixOf(weekDataHover.value)].join(
            '-'
          )
        : valueHover
    }
    return weekData.value
      ? [weekData.year, getOrdinalSuffixOf(weekData.value)].join('-')
      : value
  }, [value, valueHover, weekData, weekDataHover])

  const minDate = useMemo(() => {
    return picker === 'date' ? props.minDate : '1900/01/01'
  }, [])

  const maxDate = useMemo(() => {
    return picker === 'date' ? props.maxDate : '2100/12/31'
  }, [])

  const isFormatYYYYMMDD = useMemo(() => {
    return format === FORMAT_FORWARD_SLASH_YYYYMMDD
  }, [])

  const yearStepAction = useMemo(() => {
    return {
      prev: month === 1 ? year - 1 : year,
      next: month === 12 ? year + 1 : year,
    }
  }, [year, month])

  const monthStepAction = useMemo(() => {
    return {
      prev: month === 1 ? 12 : month - 1,
      next: month === 12 ? 1 : month + 1,
    }
  }, [month])

  const firstDayOfMonth = useMemo(() => {
    const dateObject = new Date([year, month, 1].join('/'))
    const dayIndex = dateObject.getDay()
    return dayIndex
  }, [year, month])

  const datesOldMonth = useMemo(() => {
    const result = []
    const countDateOldMonth = getTotalDateFromYearMonth(
      yearStepAction.prev,
      monthStepAction.prev
    )
    const dateFirstCalendar = countDateOldMonth - (firstDayOfMonth - 1)
    for (let i = dateFirstCalendar; i <= countDateOldMonth; i++) {
      result.push({
        dateMonthType: DATE_MONTH_TYPE.OLD_MONTH,
        value: {
          date: i,
          month: monthStepAction.prev,
          year: yearStepAction.prev,
        },
      })
    }
    return result
  }, [yearStepAction, monthStepAction, firstDayOfMonth])

  const datesCurrentMonth = useMemo(() => {
    const result = []
    const countDateCurrentMonth = getTotalDateFromYearMonth(year, month)
    for (let i = 1; i <= countDateCurrentMonth; i++) {
      result.push({
        dateMonthType: DATE_MONTH_TYPE.CURRENT_MONTH,
        value: {
          date: i,
          month,
          year,
        },
      })
    }
    return result
  }, [year, month])

  const datesFutureMonth = useMemo(() => {
    const result = []
    const countDateOldMonthAndCurrentMonth =
      datesOldMonth.length + datesCurrentMonth.length
    for (
      let i = 1;
      i <= MATRIX_CALENDAR_TOTAL - countDateOldMonthAndCurrentMonth;
      i++
    ) {
      result.push({
        dateMonthType: DATE_MONTH_TYPE.FUTURE_MONTH,
        value: {
          date: i,
          month: monthStepAction.next,
          year: yearStepAction.next,
        },
      })
    }
    return result
  }, [yearStepAction, monthStepAction, datesOldMonth, datesCurrentMonth])

  const weeks = useMemo(() => {
    return chunkArray(
      [...datesOldMonth, ...datesCurrentMonth, ...datesFutureMonth],
      7
    )
  }, [datesOldMonth, datesCurrentMonth, datesFutureMonth])

  const isPrevYearDisabled = useMemo(() => {
    return setDateDisabled(minDate, maxDate, format, {
      year: year - 1,
      month,
      date: 1,
    })
  }, [year, month])

  const isPrevMonthDisabled = useMemo(() => {
    const _date = new Date(minDate).getDate()
    return setDateDisabled(minDate, maxDate, format, {
      year: yearStepAction.prev,
      month: monthStepAction.prev,
      date: _date,
    })
  }, [year, month])

  const isNextMonthDisabled = useMemo(() => {
    const _date = new Date(maxDate).getDate()
    return setDateDisabled(minDate, maxDate, format, {
      year: yearStepAction.next,
      month: monthStepAction.next,
      date: _date,
    })
  }, [year, month])

  const isNextYearDisabled = useMemo(() => {
    return setDateDisabled(minDate, maxDate, format, {
      year: year + 1,
      month,
      date: 1,
    })
  }, [year, month])

  const isShowFullCalendar = useMemo(() => {
    return isShowDatepicker || isShowWeekPicker
  }, [isShowDatepicker, isShowWeekPicker])

  const onShowPickerContainer = () => {
    if (!hasShowPicker && !disabled) {
      setHasShowPicker(true)
    }
  }

  const onPreviousYear = () => {
    if (!isPrevYearDisabled) {
      setYear((currentYearState) => currentYearState - 1)
    }
  }

  const onPreviousMonth = () => {
    if (!isPrevMonthDisabled) {
      setMonth((currentMonthState) => {
        if (month === 1) {
          setYear((currentYearState) => currentYearState - 1)
          return 12
        }
        return currentMonthState - 1
      })
    }
  }

  const onNextMonth = () => {
    if (!isNextMonthDisabled) {
      setMonth((currentMonthState) => {
        if (currentMonthState === 12) {
          setYear((currentYearState) => currentYearState + 1)
          return 1
        }
        return currentMonthState + 1
      })
    }
  }

  const onNextYear = () => {
    if (!isNextYearDisabled) {
      setYear((currentYearState) => currentYearState + 1)
    }
  }

  const onShowMonthPicker = () => {
    setIsShowMonthPicker(true)
    setIsShowDatepicker(false)
    setIsShowWeekPicker(false)
  }

  const onShowYearPicker = () => {
    setIsShowYearPicker(true)
    setIsShowDatepicker(false)
    setIsShowMonthPicker(false)
    setIsShowWeekPicker(false)
  }

  const onPickToday = (eventName) => {
    const valueDate = getValueShoot(format, {
      year: currentYear,
      month: currentMonth,
      date: currentDate,
    })
    if (eventName === 'onClick') {
      setHasShowPicker(false)
      setYear(currentYear)
      setMonth(currentMonth)
      setDate(currentDate)
      onChange(valueDate)
    }
    eventName === 'onMouseOut' && setValueHover('')
    eventName === 'onMouseOver' && setValueHover(valueDate)
  }

  const onClearValue = () => {
    setHasShowPicker(false)
    setYear(currentYear)
    setMonth(currentMonth)
    setDate(currentDate)
    setWeekData((currentWeekDataState) => ({
      ...currentWeekDataState,
      value: null,
    }))
    onChange('')
  }

  const onDateChange = (eventName, { year, month, date }) => {
    const valueDate = getValueShoot(format, {
      year,
      month,
      date,
    })
    if (picker === 'date' && eventName === 'onClick') {
      setHasShowPicker(false)
      setYear(year)
      setMonth(month)
      setDate(date)
      onChange(valueDate)
    }
    if (picker === 'date') {
      eventName === 'onMouseOut' && setValueHover('')
      eventName === 'onMouseOver' && setValueHover(valueDate)
    }
  }

  const onPickMonth = (eventName, month) => {
    const newValue = [getPerfectDate(year), getPerfectDate(month)].join('/')
    if (eventName === 'onClick') {
      if (picker === 'date' || picker === 'week') {
        setIsShowDatepicker(true)
        setIsShowMonthPicker(false)
      }
      if (picker === 'week') {
        setIsShowWeekPicker(true)
      }
      if (picker === 'month') {
        setHasShowPicker(false)
        setIsShowYearPicker(false)
        setIsShowMonthPicker(true)
        onChange(newValue)
      }
      setMonth(month)
    }
    if (picker === 'month') {
      eventName === 'onMouseOut' && setValueHover('')
      eventName === 'onMouseOver' && setValueHover(newValue)
    }
  }

  const onPickYear = (eventName, year) => {
    if (eventName === 'onClick') {
      if (picker === 'date' || picker === 'week') {
        setIsShowDatepicker(true)
        setIsShowYearPicker(false)
      }
      if (picker === 'week') {
        setIsShowWeekPicker(true)
      }
      if (picker === 'year') {
        setHasShowPicker(false)
        onChange(year)
      }
      if (picker === 'month') {
        setIsShowYearPicker(false)
        setIsShowMonthPicker(true)
      }
      setYear(year)
    }
    if (picker === 'year') {
      eventName === 'onMouseOut' && setValueHover('')
      eventName === 'onMouseOver' && setValueHover(year)
    }
  }

  const onPickWeek = (eventName, dateValue) => {
    const val = getValueShoot(format, dateValue.value)
    const yearWeek = getWeekNumber(new Date(val))
    const valWeek = [yearWeek[0], yearWeek[1]]
    if (picker === 'week' && eventName === 'onClick') {
      setWeekData({
        value: yearWeek[1],
        ...dateValue.value,
      })
      setHasShowPicker(false)
      setYear(dateValue.value.year)
      setMonth(dateValue.value.month)
      setDate(dateValue.value.date)
      onChange(valWeek)
    }
    if (picker === 'week') {
      eventName === 'onMouseOut' &&
        setWeekDataHover({ value: null, date, month, year })
      eventName === 'onMouseOver' &&
        setWeekDataHover({
          value: yearWeek[1],
          ...dateValue.value,
        })
    }
  }

  useEffect(() => {
    const runtimeValuePropValidation = () => {
      if (!value) return
      let _value = ''
      switch (picker) {
        case 'date':
          _value = refactorValuePickerDate(value, isFormatYYYYMMDD)
          break
        case 'month':
          _value = refactorValuePickerMonth(value, isFormatYYYYMMDD)
          break
        case 'year':
          _value = refactorValuePickerYear(value, isFormatYYYYMMDD)
          break
        case 'week':
          _value = refactorValuePickerWeek(
            value,
            setWeekData,
            setYear,
            setMonth,
            setDate
          )
          break
        default:
      }
      const isInvalidDate = !isValidDate(_value)
      const date = new Date(_value)
      const _year = date.getFullYear()
      const _month = date.getMonth() + 1
      const _date = date.getDate()
      const isNotRangeMatching = setDateDisabled(minDate, maxDate, format, {
        year: _year,
        month: _month,
        date: _date,
      })
      if (isInvalidDate || isNotRangeMatching) {
        console.error(
          `Error: Failed value: Invalid prop 'value' of value ${_value} supplied to component.`
        )
        setError(true)
        !!onError && onError(true)
      } else {
        setError(false)
        !!onError && onError(false)
      }
    }
    runtimeValuePropValidation()
  }, [])

  return (
    <div
      className={getRootDatepickerClassName(
        hasShowPicker,
        disabled,
        error,
        className
      )}
      style={{ ...sx }}
      ref={morDatepickerRef}
      onClick={onShowPickerContainer}
    >
      <input
        className="mor-datepicker-input-value"
        value={valueView}
        placeholder={placeholder}
        readOnly={true}
      />
      <CalendarIcon className="mor-calendar-icon" />
      {hasShowPicker && (
        <div className="mor-picker-container" ref={morPickerContainerRef}>
          <div className="mor-picker-header">
            <div className="mor-button-previous">
              <button
                className={`mor-year-button-prev${
                  isPrevYearDisabled ? ' mor-year-button-prev-disabled' : ''
                }`}
                onClick={onPreviousYear}
              >
                <span className="mor-year-button-prev-custom"></span>
              </button>
              {isShowFullCalendar && (
                <button
                  className={`mor-month-button-prev${
                    isPrevMonthDisabled ? ' mor-month-button-prev-disabled' : ''
                  }`}
                  onClick={onPreviousMonth}
                >
                  <span className="mor-month-button-prev-custom"></span>
                </button>
              )}
            </div>
            <div className="mor-picker-month-year">
              {isShowFullCalendar && (
                <div className="mor-month-value" onClick={onShowMonthPicker}>
                  {MONTH_LABELS[month - 1]}
                </div>
              )}
              <div className="mor-year-value" onClick={onShowYearPicker}>
                {year}
              </div>
            </div>
            <div className="mor-button-next">
              {isShowFullCalendar && (
                <button
                  className={`mor-month-button-next${
                    isNextMonthDisabled ? ' mor-month-button-next-disabled' : ''
                  }`}
                  onClick={onNextMonth}
                >
                  <span className="mor-month-button-next-custom"></span>
                </button>
              )}
              <button
                className={`mor-year-button-next${
                  isNextYearDisabled ? ' mor-year-button-next-disabled' : ''
                }`}
                onClick={onNextYear}
              >
                <span className="mor-year-button-next-custom"></span>
              </button>
            </div>
          </div>
          <div
            id="mor-picker-main"
            className={`mor-picker-main${
              isShowYearPicker ? ' mor-picker-main-year-scroll' : ''
            }`}
          >
            {isShowFullCalendar && (
              <Fragment>
                <div className="mor-list-day">
                  {DAY_LABELS.map((day) => (
                    <div className="mor-day" key={day}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="mor-list-date">
                  {weeks.map((week, index) => (
                    <div
                      className={getWeekClassName(
                        week,
                        weekData,
                        format,
                        picker,
                        minDate,
                        maxDate,
                        isShowWeekPicker
                      )}
                      key={index}
                      onClick={() => onPickWeek('onClick', week[3])}
                      onMouseOver={() => onPickWeek('onMouseOver', week[3])}
                      onMouseOut={() => onPickWeek('onMouseOut', week[3])}
                    >
                      {week.map((dateObject, index) => (
                        <div
                          className={getDateClassName(
                            value,
                            format,
                            minDate,
                            maxDate,
                            dateObject.dateMonthType,
                            dateObject.value
                          )}
                          title={
                            picker === 'date'
                              ? getValueShoot(format, dateObject.value)
                              : null
                          }
                          key={index}
                          onClick={() =>
                            onDateChange('onClick', dateObject.value)
                          }
                          onMouseOver={() =>
                            onDateChange('onMouseOver', dateObject.value)
                          }
                          onMouseOut={() =>
                            onDateChange('onMouseOut', dateObject.value)
                          }
                        >
                          {dateObject.value.date}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Fragment>
            )}
            {isShowMonthPicker && (
              <MonthPicker
                months={MONTH_LABELS}
                year={year}
                value={month}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
                format={format}
                valueGlobal={value}
                onChange={onPickMonth}
              />
            )}
            {isShowYearPicker && (
              <YearPicker
                value={year}
                valueGlobal={value}
                month={month}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
                format={format}
                onChange={onPickYear}
              />
            )}
          </div>
          <div className="mor-clear-and-pick-today">
            {value && (
              <div className="mor-clear" onClick={onClearValue}>
                Clear
              </div>
            )}
            {!setDateDisabled(minDate, maxDate, format, {
              year: currentYear,
              month: currentMonth,
              date: currentDate,
            }) &&
              isShowDatepicker && (
                <div
                  className="mor-today"
                  title={getValueShoot(format, {
                    year: currentYear,
                    month: currentMonth,
                    date: currentDate,
                  })}
                  onClick={() => onPickToday('onClick')}
                  onMouseOver={() => onPickToday('onMouseOver')}
                  onMouseOut={() => onPickToday('onMouseOut')}
                >
                  Today
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}

Datepicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  picker: PropTypes.oneOf(['date', 'month', 'year', 'week']),
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  sx: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
}

Datepicker.defaultProps = {
  className: '',
  picker: 'date',
  disabled: false,
  format: 'YYYY/MM/DD',
  minDate: '1900/01/01',
  maxDate: '2100/31/12',
}

export default Datepicker
