import { useEffect, useMemo } from 'react'
import { setDateDisabled } from '../../utils'
import { currentYear } from '../../constants'
import './style.css'

const YearPicker = (props) => {
  const {
    value,
    valueGlobal,
    month,
    date,
    minDate,
    maxDate,
    format,
    onChange,
  } = props

  const listYears = useMemo(() => {
    const result = []
    for (let year = 1900; year <= 2100; year++) {
      result.push(year)
    }
    return result
  }, [])

  const getYearClassName = (yearItem) => {
    let initClassName = 'mor-year'
    if (yearItem.toString() === value.toString() && valueGlobal) {
      initClassName += ' mor-year-selected'
    }
    if (yearItem === currentYear) {
      initClassName += ' mor-year-current'
    }
    if (
      setDateDisabled(minDate, maxDate, format, { year: yearItem, month, date })
    ) {
      initClassName += ' mor-year-disabled'
    }
    return initClassName
  }

  useEffect(() => {
    const morPickerMainEl = document.getElementById('mor-picker-main')
    const yearItemEl = document.getElementById(`mor-year-${value}`)
    if (yearItemEl) {
      const yearItemOffsetTop = yearItemEl.offsetTop
      const yearItemHeight = yearItemEl.clientHeight
      morPickerMainEl.scrollTo(0, yearItemOffsetTop - yearItemHeight)
    }
  }, [value])

  return (
    <div className="mor-year-picker">
      {listYears.map((yearItem) => (
        <div
          id={`mor-year-${yearItem}`}
          className={getYearClassName(yearItem)}
          key={yearItem}
          onClick={() => onChange('onClick', yearItem)}
          onMouseOver={() => onChange('onMouseOver', yearItem)}
          onMouseOut={() => onChange('onMouseOut', yearItem)}
        >
          {yearItem}
        </div>
      ))}
    </div>
  )
}

export default YearPicker
