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

    // function convertToCSV(objArray) {
    //     var array = JSON.parse(objArray);
    //     var str = '';
    //     var headers = Object.keys(objArray[0]);

    //     for (var i = 0; i < array.length; i++) {
    //         var line = '';
    //         for (var index in array[i]) {
                
    //             line += array[i][index];
    //             line += ','
    //         }

    //         str += line + '\r\n';
    //     }

    //     return str;
    // }
    // var csv = convertToCSV(items);

// res.send(csv);
    const readFile = util.promisify(fs.readFile)


    return (readFile(path.join(__dirname, './../client/index.html')))
        .then(fileContents => {
            console.log(fileContents.toString());
            var stringFileContents = fileContents.toString();
            // res.send(fileContents.toString());
            return stringFileContents.replace("CSV will return here!", csv);
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