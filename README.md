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

const config = {
  // todo
}

const MyComponent = () => {
  const [value, setValue] = useState('')
  
  const handleValueChange = (newValue) => {
    setValue(newValue)
  }

  return (
    <Datepicker
      value={value}
      picker={picker}
      config={config}
      onChange={handleValueChange}
    />
  )
}

export default MyComponent
```


## License

Copyright (c) 2022 Khanh Nguyen.

Licensed under The MIT License (MIT).
