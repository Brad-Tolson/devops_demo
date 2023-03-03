const express = require('express')
const app = express()
const path = require('path')
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: '11ef98de75904cfca738d7f4c8e7f1a4',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
app.use(express.json());

// student data

const students = [ 'Jimmy', 'Timothy', 'Jimothy']
rollbar.log("site is live")
// endpoints
app.get('/', function(req, res) {
  rollbar.log('site visited')
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
    rollbar.info('student list is sent')

})

app.post('/api/students', (req, res) => {
    let { name } = req.body;

    const index = students.findIndex(student => {
        return student === name
    })

    try {
        if (index === -1 && name !== "") {
          students.push(name);
          rollbar.info('Someone added a student')
          res.status(200).send(students);
        } else if (name === "") {
            rollbar.error('Someone tried to enter a blank student')

            res.status(400).send("must provide a name");
        } else {
            rollbar.warning('Someone tried to enter a duplicate student name')
          res.status(400).send("that student already exists");
        }
      } catch (err) {
        console.log(err)
        rollbar.error(err)
      }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index

    students.splice(targetIndex, 1);

    rollbar.info('Someone deleted a student')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050;

app.listen(port, function() {
    console.log('Server rocking out on ${port}')
})