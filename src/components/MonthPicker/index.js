import { currentYear, currentMonth } from '../../constants'
import { setDateDisabled } from '../../utils'
import './style.css'

const MonthPicker = (props) => {
  const { months, value, year, minDate, maxDate, format, date, valueGlobal, onChange } = props

  const getMonthClassName = (year, month) => {
    let initClassName = 'mor-month'
    if (year === currentYear && month === currentMonth) {
      initClassName += ' mor-month-current'
    }
    if (year === new Date(valueGlobal).getFullYear() && month === value) {
      initClassName += ' mor-month-selected'
    }
    if (setDateDisabled(minDate, maxDate, format, { year, month, date })) {
      initClassName += ' mor-month-disabled'
    }
    return initClassName
  }

  return (
    <div className="mor-month-picker">
      {months.map((monthText, index) => (
        <div
          className={getMonthClassName(year, index + 1)}
          key={monthText}
          onClick={() => onChange('onClick', index + 1)}
          onMouseOver={() => onChange('onMouseOver', index + 1)}
          onMouseOut={() => onChange('onMouseOut', index + 1)}
        >
          {monthText}
        </div>
      ))}
    </div>
  )
}

export default MonthPicker
