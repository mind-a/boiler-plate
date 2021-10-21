const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dahyemin:als0602@boilerplate.8czpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected ...'))
.catch((e) => console.log('MongoDB error: ', e))

app.get('/', (req, res) => {
  res.send('Hello World!~ 안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})