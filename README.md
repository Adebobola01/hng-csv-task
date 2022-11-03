# hng-csv-task

<h2>Install</h2>

1. download the zip file by pressing the green button labeled "code"
2. unzip the file

<h2>Usage</h2>

1. copy your ```.csv``` file into the root directory
2. create a javascript file in the root directory
3. inside this js file import ```app``` from app.js

```
const parseCSV = require("./app").app;   //use any name of your choice for the import
```
4. call the function with the arguments

```
parseCSV("<filename without the ".csv">", [<array of the csv header>])

//e.g parseCSV("file", ["TEAM NAMES", "Series Number", "Filename"])
```
5. The result will be ```<file name>.output.csv``` file created in the root folder as output
