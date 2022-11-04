const csv = require("csv-parser");
const fs = require("fs");
const crypto = require("crypto");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
let csvWriter;
const results = []
let teamName;

const sampleJson = {
    "format": "CHIP-0007",
    "name": "Pikachu",
    "description": "Electric-type Pokémon with stretchy cheeks",
    "minting_tool": "SuperMinter/2.5.2",
    "sensitive_content": false,
    "series_number": 22,
    "series_total": 420,
    "attributes": [],
    "collection": {
        name: "Zuri NFT Tickets for Free Lunch",
        id: "b774f676-c1d5-422e-beed-00ef5510c64d",
        attributes: [
            {
                type: "description",
                value: "Rewards for accomplishments during HNGi9."
            }
        ]
    }
}


//function to get the headers of the csv file
const getHeaders = (_filename) => {
    fs.createReadStream(`${_filename}.csv`)
        .pipe(csv())
        .on("headers", async(headers) => {
            header.push(...headers)
        }).on("end", () => {
            console.log(header)
        })
}


const readCSVfile = async (filename) => {
    fs.createReadStream(`${filename}.csv`)
        .pipe(csv())
        .on("data", (data) => {

            if (data["TEAM NAMES"]) {
                teamName = data["TEAM NAMES"]
            }
            
            const json = sampleJson;

            //CHANGING JSON DATA BASED ON NFT INFO
            json.name = data.Name;
            json.description = data.Description;
            json["TEAM NAMES"] = teamName;
            json.series_number = Number(data['Series Number']);
            json.attributes.push({
                "trait_type": "Gender",
                "value": data.Gender,
            })
            json.collection.id = data.UUID;

            //CHANGING ATTRIBUTE TO THE RIGHT FORMAT
                json.attributes = data.Attributes.split("; ");
                const arr = json.attributes.map((atr) => {
                    const trait = atr.split(": ")[0];
                    const value = atr.split(": ")[1];
                   return {
                        "trait_type": trait,
                        "value": value,
                    }
                    ;
                });
            json.attributes = arr
            //WRITE JSON TO FILE
            fs.writeFileSync(`jsons/${data.Filename}.json`, JSON.stringify(json), err => {
                if (err) {
                    console.log(err)
                }
            })
            //SHA256 HASHING
            const hash = crypto.createHash("sha256");
            const finalHex = hash.update(JSON.stringify(json)).digest("hex");
            data.Hash = finalHex;
            
            results.push(data);


        })
        .on("end", async () => {
            //WRITING TO CSV FILE
            await csvWriter.writeRecords(results);
        });
};



exports.app = async (filename) => {
    fs.createReadStream(`${filename}.csv`)
        .pipe(csv())
        .on("headers", async(headers) => {
            csvWriter = createCsvWriter({
                path: `./${filename}.output.csv`,
                header:  [...headers, "Hash"].map((item) => ({ id: item, title: item })),
            });
        })
    readCSVfile(filename);
}
