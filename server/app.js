const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs');
const util = require('util');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));

app.use(express.static(path.join(__dirname, './../client')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../client/index.html'))
})

app.post('/', (req, res) => {
    // res.send(req.body.content);

    const items = JSON.parse(req.body.content);
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    csv = csv.join('\r\n')

    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);

    return (writeFile(path.join(__dirname, './../client/results.csv'),csv,(err) => {
        if (err) throw err;
        console.log("the file has been saved!");
    }))
        .then(() => {
            return readFile(path.join(__dirname, './../client/index.html'))
        })
    // return (readFile(path.join(__dirname, './../client/index.html')))
        .then(fileContents => {
            console.log(fileContents.toString());
            var stringFileContents = fileContents.toString();
            // res.send(fileContents.toString());
            return stringFileContents.replace("CSV contents will show up here!", csv);
        })
        .then(newFileContents => {
            console.log(newFileContents);
            return res.send(newFileContents);
        })
        .catch(() => {
            return res.send(csv);
        })

});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

