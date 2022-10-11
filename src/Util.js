const fs = require("fs");
const path = require("path");

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function GenerateHTMLHeader()
{
    return "<!DOCTYPE html><html>";
}

function GenerateHTMLFooter()
{
    return "</html>";
}

module.exports = { ReadFile, GenerateHTMLHeader, GenerateHTMLFooter };