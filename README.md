# hng-csv-task

<h2>Install</h2>

1. download the zip file by pressing the green button labeled "code"
2. unzip the file

<h2>Usage</h2>

1. copy your ```.csv``` file into the root directory
2. create a javascript file in the root directory
3. inside this js file import ```app``` from app.js and store it in a variable (example below 👇)

```
const parseCSV = require("./app").app;   //use any name of your choice for the import
```
4. call this variable as a function with arguments (arguments specified below 👇)

```
parseCSV("<filename without the ".csv">)

//e.g parseCSV("myCsvFile")
```
5. Run npm install in your cli
6. Run your js file in the cli

```
npm install
node <your js filename>
```
7. The result will be ```<csv file name>.output.csv``` file created in the root folder as output and all the json file get created into the json folder
