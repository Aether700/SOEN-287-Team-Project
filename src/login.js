const util = require("../src/Util.js");
const fs = require("fs");
const database = require("../src/Database.js");
const accountsFilepath = util.dataDirectory + "/accounts.json";

// function responsible for hashing provided passwords
function HashPassword(password)
{
    let hash = 0;
    for (let i = 0; i < password.length; i++)
    {
        hash = (hash + Math.pow(password.charCodeAt(i), i + 1)) % 4093;
    }
    return hash;
}

var accounts = new Array();


function InitializeDefaultStaticAccounts()
{
    accounts.push(new Account("teacher", HashPassword("teacher"), 
        AccountType.Teacher, database.GenerateGUID()));
    accounts.push(new Account("student", HashPassword("student"), 
        AccountType.Student, database.GenerateGUID()));

    database.SaveGUIDs();
}

function LoadAccounts()
{
    console.log("Loading Accounts From File");
        
    // contains generic objects not Accounts
    let tempArr = JSON.parse(util.ReadFile(accountsFilepath));
        
    tempArr.forEach(function(account)
    {
        accounts.push(new Account(account.username, account.passwordHash, account.userType, account.id));
    });
}

function SaveAccounts()
{
    console.log("Saving Accounts To File");
    let data = "[";
    accounts.forEach(function(account)
    {
        data += account.ToJSONStr() + ",";
    });

    if (accounts.length > 0)
    {
        data = data.slice(0, data.length - 1);
    }

    data += "]";
        
    fs.writeFile(accountsFilepath, data, function(err)
    {
        if (err)
        {
            console.error(err);
        }
    });
}

function InitializeAccounts()
{
    console.log("initializing accounts");
    if (fs.existsSync(accountsFilepath))
    {
        LoadAccounts();
    }
    else
    {
        console.log("Generating New Account Data");
        
        if (!fs.existsSync(util.dataDirectory))
        {
            fs.mkdirSync(util.dataDirectory);
        }

        InitializeDefaultStaticAccounts();
        SaveAccounts();
    }
}

function OnLogin(form)
{
    let username = form.username;
    let passwordHash = HashPassword(form.password);
    return accounts.find(function (account)
    {
        return account.Validate(username, passwordHash)
    });
}

module.exports = { OnLogin };