const hF = require('human-format')

const value = 200

const formattedValue = hF(value, {
  scale: new hF.Scale({
    Thousand: 1000
  }),
  unit: ' Requests Per Second'
})

console.log(formattedValue)
