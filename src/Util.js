const fs = require("fs");
const path = require("path");
const dataDirectory = "../../data";

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function WriteToFile(filepath, data)
{
    fs.writeFile(filepath, data, function(err)
    {
        if (err)
        {
            console.error(err);
        }
    });
}

function GenerateHTMLHeader()
{
    return "<!DOCTYPE html><html>";
}

function GenerateHTMLFooter()
{
    return "</html>";
}

function GeneratePageHeader()
{
    return "<h1 style=\"position: relative;padding:0.6%;margin:0; width:102% ; height:6.5%; top: -8px; left: -15px; right: 0; " +
        "text-align: center;font-size:40px; background: #912338; color: white;\">Concordia University</h1>";
        
}

function GeneratePageFooter()
{
    return "<h5 style=\"position: absolute; padding:0.6%; width:102%;height:6%; left: -15px;" + 
        "right: 0%; text-align: center; background: #912338; color: white;\"> " + 
        "Website made by Hao Mei, Jamil Hanachian, James Teasdale, Alex Ye, Catherine Pham " + 
        "& Nikita Ciobanu</h6>";
}

function GenerateClientSideFunctionSendPostForm(hostname, port)
{
    return ""
        + "function SendFormPost(form, onLoadCallback, onErrorCallback)\n"
        + "{\n"
        + "   let request = new XMLHttpRequest();\n"
        + "   let urlPairs = [];\n"
        + "   for (let [name, value] of Object.entries(form))\n"
        + "   {\n"
        + "       urlPairs.push(encodeURIComponent(name) + \"=\" + encodeURIComponent(value));\n"
        + "   }\n\n"
 
        + "   let urlEncodedData = urlPairs.join(\"&\").replace(/%20/, \"+\");\n\n"
      
        + "   request.addEventListener(\"load\", onLoadCallback);\n\n"
        
        + "   if (onErrorCallback == undefined)\n"
        + "   {\n"
        + "       onErrorCallback = function()\n"
        + "       {\n"
        + "           alert(\"An error occured\");\n"
        + "       };\n"
        + "   }\n\n"
          
        + "   request.addEventListener(\"error\", onErrorCallback);\n\n"
              
        + "   request.open(\"POST\", \"" + hostname + ":" + port + "\");\n"
        + "   request.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");\n"
        + "   request.send(urlEncodedData);\n"
        + "}\n";
}

function GenerateClientSideFunctionSendGetRequest()
{
    return ""
        + "function SendGetRequest(resource)\n"
        + "{\n"
        + "    var xmlHttp = new XMLHttpRequest();\n"
        + "    xmlHttp.open(\"GET\", resource, false );"
        + "    xmlHttp.send();\n"
        + "    return xmlHttp.responseText;\n"
        + "}\n";
}

module.exports = { 
    ReadFile, WriteToFile, GenerateHTMLHeader, 
    GenerateHTMLFooter, GenerateClientSideFunctionSendPostForm, 
    GenerateClientSideFunctionSendGetRequest,
    GeneratePageFooter, GeneratePageHeader,
    dataDirectory };