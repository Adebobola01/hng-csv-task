const csv = require("csv-parser");
const fs = require("fs");
const crypto = require("crypto");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: "./hngTask.output.csv",
    header: [
        "Series Number",
        "Filename",
        "Name",
        "Description",
        "Gender",
        "Attributes",
        "UUID",
        "Hash",
    ].map((item) => ({ id: item, title: item })),
});

const results = [];

const readCSVfile = async () => {
    fs.createReadStream("hngTask.csv")
        .pipe(csv())
        .on("data", async (data) => {
            if (!data.Filename) {
                return;
            }

            if (data.Attributes) {
                const attributes = data.Attributes.split(", ");
                data.Attributes = [];
                attributes.forEach((atr) => {
                    const trait = atr.split(": ")[0];
                    const value = atr.split(": ")[1];
                    data.Attributes.push(
                        JSON.stringify({
                            trait_type: trait,
                            value: value,
                        })
                    );
                });
            }

            const hash = crypto.createHash("sha256");
            const finalHex = hash.update(data.toString()).digest("hex");
            data.Hash = finalHex;
            results.push(data);
            // console.log(data);
            await csvWriter.writeRecords(results);
        })
        .on("end", async () => {
            console.log(results);
        });
};

readCSVfile();
