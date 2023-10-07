import { readFile, writeFile } from "fs";
import { resolve } from "path";

let content;
const uuidLength = Number(process.argv[2] ?? 120);
console.log(`Opening file: ${resolve(__dirname + "/../.env")}`);

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

console.log(process.argv);

readFile(resolve(__dirname + "/../.env"), "utf-8", (err, data) => {
    if (err) throw err;

    content = data;

    let contentLines = content.split("\n");

    for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes("APP:KEY")) {
            let res = "";
            const chaLength = chars.length;

            for (let i = 0; i < uuidLength; i++) {
                res += chars.charAt(Math.floor(Math.random() * chaLength));
            }

            contentLines[i] = `APP_KEY=${res}`;
        }
    }

    contentLines = contentLines.join("\n");

    writeFile(resolve(__dirname + "/../.env"), contentLines, {encoding: "utf-8", flag: "w"}, err => {
        if (err) console.log(err);
        else console.log("APP_KEY updated!");
    });
});