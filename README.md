# mor-react-datepicker

`mor-react-datepicker` is a datepicker ReactJS component.

# Getting started

## Install

```sh
$ npm install mor-react-datepicker
```

Alternatively, you may use the provided UMD builds directly in the `<script>` tag of an HTML page. See [this section](#using-umd-build-in-the-browser).

## Usage Example

```javascript
import Datepicker from 'mor-react-datepicker'

const MyComponent = () => {
  const [value, setValue] = useState('')

  const handleValueChange = (newValue) => {
    setValue(newValue)
  }

  return (
    <Datepicker
      picker="date"
      placeholder="Select date"
      format="YYYY/MM/DD"
      minDate="2011/08/22"
      maxDate="2022/10/27"
      disabled={false}
      dayLabels={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
      monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec']}
      value={value}
      onChange={handleValueChange}
    />
  )
}

export default MyComponent
```

## License

Copyright (c) 2022 Khanh Nguyen.

Licensed under The MIT License (MIT).
