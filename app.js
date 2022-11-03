const csv = require("csv-parser");
const fs = require("fs");
const crypto = require("crypto");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// const filename = "datas";


exports.app = (filename, headerArr, ) => {
    
    const csvWriter = createCsvWriter({
        path: `./${filename}.output.csv`,
        header: [
           ...headerArr
        ].map((item) => ({ id: item, title: item })),
    });
    
    const results = [];
    let teamName;
    
    const readCSVfile = async () => {
        fs.createReadStream(`${filename}.csv`)
            .pipe(csv())
            .on("data", async (data) => {
                if (data['TEAM NAMES']) {
                    teamName = `${data['TEAM NAMES']} Collection`;
                }
    
                //JSON SCHEMA
                const json = {
                    "format": "CHIP-0007",
                    "name": "Pikachu",
                    "description": "Electric-type Pokémon with stretchy cheeks",
                    "minting_tool": "SuperMinter/2.5.2",
                    "sensitive_content": false,
                    "series_number": 22,
                    "series_total": 1000,
                    "attributes": [
    
                    ],
                    "collection": {
                        "name": "Example Pokémon Collection",
                        "id": "e43fcfe6-1d5c-4d6e-82da-5de3aa8b3b57",
                    },
                }
    
                //CHANGING JSON DATA BASED ON NFT INFO
                json.name = data.Name;
                json.description = data.Description;
                json.series_number = data['Series Number'];
                json.attributes.push({
                    "trait_type": "Gender",
                    "value": data.Gender,
                })
                json.collection.name = teamName;
                json.collection.id = data.UUID;
    
                //CHANGING ATTRIBUTE TO THE RIGHT FORMAT
                if (data.Attributes) {
                    const attributes = data.Attributes.split("; ");
                    data.Attributes = [];
                    attributes.forEach((atr) => {
                        const trait = atr.split(": ")[0];
                        const value = atr.split(": ")[1];
                        data.Attributes.push({
                            "trait_type": trait,
                            "value": value,
                        });
                        json.attributes.push({
                            "trait_type": trait,
                            "value": value,
                        }
                        );
                    });
                }
    
                //SHA256 HASHING
                const hash = crypto.createHash("sha256");
                const finalHex = hash.update(JSON.stringify(json)).digest("hex");
                data.Hash = finalHex;
    
                //CHANGING ATTRIBUTE FORMAT BACK
                if (data.Attributes) {              
                    const atr = data.Attributes.map((atr) => {
                        return `${atr.trait_type}: ${atr.value}` 
                    })
                    data.Attributes = atr.join("; ")
                }
                console.log(json)
                results.push(data);
            })
            .on("end", async () => {
                //WRITING TO CSV FILE
                await csvWriter.writeRecords(results);
            });
    };
    
    readCSVfile();
}
