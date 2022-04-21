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

  return <Datepicker value={value} onChange={handleValueChange} />
}

export default MyComponent
```

| Prop                | Description                                      | Type                                            | Default        |
| ------------------- | ------------------------------------------------ | ----------------------------------------------- | -------------- |
| value               | default value => '', week value format [yyyy/mm] | `string|number|array`                           |                |
| placeholder         | placeholder text                                 | `string`                                        | ''             |
| picker              | type picker                                      | `string`                                        | 'date'         |
| format              | YYYY/MM/DD | DD/MM/YYYY                          | `string`                                        | 'YYYY/MM/DD'   |
| disabled            | ------------------------------------------------ | `boolean`                                       | false          |
| dayLabels           | String array: length 7                           | `array`                                         | -------------- |
| monthLabels         | String array: length 12                          | `array`                                         | -------------- |
| onChange            | callback function                                | `func`                                          | -------------- |
| minDate             | ------------------------------------------------ | `string`                                        | '1900/01/01'   |
| minDate             | ------------------------------------------------ | `string`                                        | '2100/12/31'   |

## License

Copyright (c) 2022 Khanh Nguyen.

Licensed under The MIT License (MIT).
