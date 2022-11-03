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
                    "series_total": 420,
                    "attributes": [
    
                    ],
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
    
                //CHANGING JSON DATA BASED ON NFT INFO
                json.name = data.Name;
                json.description = data.Description;
                json.series_number = data['Series Number'];
                json.attributes.push({
                    "trait_type": "Gender",
                    "value": data.Gender,
                })
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
