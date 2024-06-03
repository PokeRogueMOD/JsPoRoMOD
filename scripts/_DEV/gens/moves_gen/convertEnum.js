const fs = require("fs");
const ts = require("typescript");

// Read the TypeScript file
const filePath = "./moves.ts";
const fileContent = fs.readFileSync(filePath, "utf8");

// Create a source file using TypeScript compiler API
const sourceFile = ts.createSourceFile(
    "temp.ts",
    fileContent,
    ts.ScriptTarget.Latest
);

// Function to convert TypeScript enum to JavaScript object
function convertEnumToJsObject(sourceFile) {
    const result = {};

    function visit(node) {
        if (ts.isEnumDeclaration(node)) {
            node.members.forEach((member, index) => {
                const key = member.name.text;
                const transformedKey = transformString(key);
                result[index] = transformedKey;
            });
        } else {
            ts.forEachChild(node, visit);
        }
    }

    function transformString(str) {
        return str
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    ts.forEachChild(sourceFile, visit);
    return result;
}

// Convert the TypeScript enum to a JS object
const jsObject = convertEnumToJsObject(sourceFile);

// Manually create the single-line JS content with integer keys
let jsContent = "const Moves = {";
for (const [key, value] of Object.entries(jsObject)) {
    jsContent += `${key}: "${value}", `;
}
jsContent = jsContent.slice(0, -2) + "};\n\nmodule.exports = Moves;";

// Write the result to a JS file
fs.writeFileSync("./moves.js", jsContent);

console.log("Enum converted successfully!");
