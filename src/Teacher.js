const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(assessment, question, index)
{
    return "<tr><th>" + question.GetMaxGrade() 
        + "</th><td>" + assessment.GetQuestionAverage(index) + "</td></tr>";
}

function AssessmentToHTMLStrTeacherGrade()
{
    return `
    <div ><h2>SOEN 287 Section Q</h2> </div>
    <div><h3>Add assessment for a student</h3></div>
    <div class="mainBox">
        <div class="text02Box"> 
            <input type =  "hidden" name = "formType" value = "createAssessment"/>
            <span class="datum">Assessment Name:&emsp;</span>
            <input id = "assessmentName" type="text"/>
            <br>
            <span class="datum" >Weight:&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;</span>
            <input id="weight" type="number" min = 0.0001 step = any max = 100/><span> % </span>
            <br>
            <br>
            <span class="datum">Number of questions:</span>
            <input id = "numQuestions" type="number" min = 1/>
            <br>
            <br>
            <button type = "button" class="dropbtn" onclick = "GenerateAssessmentGradeTable();">Create Assessment</button>
            <br>
            <br>
            
            <div id = "questionTable">
            </div>
            
        </div>
    </div> `;
}
        
function AssessmentToHTMLStrTeacher(assessment)
{
    let htmlStr = "<h2><b><u>" + assessment.GetName() + "</u></h2>";
            
    htmlStr += "<h3><b>Distribution</h3>";
    let distribution = assessment.GetDistribution();
    htmlStr += "<table>";
    distribution.forEach(function(numStudents, grade)
    {
        htmlStr += "<tr><td><b>Grade: </b>" + grade + "</td>" + "<tr><td>Number of Students: " + numStudents + "</td></tr>";
    });
            
    htmlStr += "</table>";
            
    htmlStr += "<h3><b>Marks of each student (ID)</h3>";
    let totals = assessment.GetTotals();

    htmlStr += "<table>";
    htmlStr += "<tr><th>Student ID</th><th>Total</th></tr>";
    totals.forEach(function (total, id)
    {
        htmlStr += "<tr><th>" + id + "</th><th>" + total + "</th></tr>";
    });
    htmlStr += "</table>";
    
    htmlStr += "<h3><b>Questions</h3>";

    htmlStr += "<table>";
    htmlStr += "<tr><th>Max Grade For The Question</th><th>Average</th></tr>";
    let questions = assessment.GetQuestions();
    for (let i = 0; i < questions.length; i++)
    {
        htmlStr += QuestionToHTMLStrTeacher(assessment, questions[i], i);
    }
    htmlStr += "</table>";
    return htmlStr;
}

function LoadTeacherLetterGrade(user, hostname, port)
{
    console.log("loading /teacher/letterGrade/" + user.GetID());
    const studentIds = database.database.GetStudentIDs()
    const numberOfStudents = studentIds.length

    const studentData = studentIds.map((studentId) =>{
        return {
            id: studentId,
            grade: database.database.GetLetterGrade(studentId)
        }
    });
    
    return `
    <input type="button" onclick = "document.location.href = '/teacher/home/` + user.GetID() 
        + `'" value="Go back to assessment page"> <style> input[type=button]{background-color:#0a0a23;color: #fff; border:5px double #cccccc;border-radius:15px;} input[type=button]:hover{  background-color:#0a0a23;color: #Ff0000; border:5px double #cccccc;border-radius:15px; }  input[type=button]:active{ transform: scale(0.90);} </style>
    <div ><h2>SOEN 287 Section Q </h2> </div>
    <div><h3><u style='color:#912338;'>Assign letter grade for the students</u></h3></div>
    <div><h4>&emsp;ID &emsp;&emsp;&emsp;&emsp; Letter Grade</h4></div>

    <div class="mainBox">
        <form id = "letter_grade">
        </form>
        <style> form {
            background-color:#912338;
            width: 300px;
            padding:10px;
            font-weight:bold;
            margin:-7px;
            border-radius:15px;
            border:2px solid black;
            line-height: 30px;
           }
           </style>
    </div>
   
    <script>
        // Generate a dynamic number of inputs
        var number = ${numberOfStudents};
        // Get the element where the inputs will be added to
        var letter_grade = document.getElementById("letter_grade");
        var studentIds = [${studentIds}]
        const studentData = ${JSON.stringify(studentData)}

        ` + util.GenerateClientSideFunctionSendPostForm(hostname, port) + `

        function SendLetterGradeForm()
        {
            let formData = 
            {
                id: ` + user.GetID() + `,
                formType: "changeLetterGrade",
                letterGradeMapJson: "["
            };

            let gradeList = document.getElementsByName("letterGradeInput");
            let gradeArr = new Array();

            gradeList.forEach(function (item, key)
            {
                if (item.value == "" || item.value == undefined)
                {
                    gradeArr.push("` + database.noLetterGradeMessage + `");
                }
                else
                {
                    gradeArr.push(item.value);
                }
            });

            for (let i = 0; i < ` + numberOfStudents + `; i++)
            {
                formData.letterGradeMapJson += "{\\"key\\":" +  studentData[i].id 
                    + ", \\"value\\": \\"" + gradeArr[i] + "\\"}";
                if (i != ` + numberOfStudents + ` - 1)
                {
                    formData.letterGradeMapJson += ",";
                }
            }

            formData.letterGradeMapJson += "]";

            console.log(formData.letterGradeMapJson);

            SendFormPost(formData, function (event)
            {
                console.log("Finished loading letter grade");
            });
        }

        for (i=0;i<number;i++){
            const studentId = studentIds[i];
            letter_grade.appendChild(document.createTextNode(studentId));
            var input = document.createElement("input"); 
            input.type = "text";
            input.placeholder = "Enter letter grade";
            if (typeof studentData[i].grade !== "undefined" ){
                input.value = studentData[i].grade
            }
            input.name = "letterGradeInput"; 
            input.id = studentId;
            letter_grade.appendChild(input);
            letter_grade.appendChild(document.createElement("br"));
        }
        var submit_button = document.createElement("input");
        submit_button.type = "button";
        submit_button.value = "Submit";
        submit_button.onclick = SendLetterGradeForm;
        letter_grade.appendChild(submit_button);
    </script>`;
}

function GenerateTeacherPageHead()
{
    return "<head>" + GenerateStyle() +"</head>";
}

function GenerateOverviewRow(assessment)
{
    return "<tr><th>" + assessment.GetName() + "</th><td>" + assessment.GetWeight() 
        + "</td><td>" + assessment.GetAverage() + "</td></tr>";
}

function GenerateOverview(assessments)
{
    let htmlStr = "<table><caption><b>Overview</caption><tr><th></th><th>Weight</th><th>Average</th></tr>";
    assessments.forEach(function (assessment)
    {
        htmlStr += GenerateOverviewRow(assessment);
    });
    htmlStr += "</table>";
    return htmlStr;
}

function GenerateTeacherBody(user)
{
    let body = "<body style='position:absolute;width:100%;overflow-x: hidden;height:100%;top:0;left:0;'>";
    body += util.GeneratePageHeader();
    body += AssessmentToHTMLStrTeacherGrade() + "<br/><br/>";
    let assessments = user.GetAssessmentsTeacher();
    body += GenerateOverview(assessments);

    // specifics
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrTeacher(assessment);
    });

    body += "<br><br><input type='button' onclick = \"document.location.href = '/teacher/letterGrade/" 
        + user.GetID() + "';\" value='Assign letter grades' /> "
   

    body += util.GeneratePageFooter();
    body += "<script src=\"/teacher/TeacherClientSide.js/" + user.GetID() + "\"></script>";
    body += "</body>";
    return body;
}

function GenerateStyle()
{
    return "<style> table, th, td {border:1px solid black;border-radius: 10px;}  u{color: #912338} p{font-weight: bold;} button{background-color:#0a0a23;color: #fff; border:5px double #cccccc;border-radius:15px;} button:hover{  background-color:#0a0a23;color: #Ff0000; border:5px double #cccccc;border-radius:15px; }button:active{transform: scale(0.90);}"+
    " input[type=button]:active{ transform: scale(0.90);} input[type=button]{background-color:#0a0a23;color: #fff; border:5px double #cccccc;border-radius:15px;} input[type=button]:hover{  background-color:#0a0a23;color: #Ff0000; border:5px double #cccccc;border-radius:15px; } </style>"
}

function LoadTeacherHomePage(user)
{
    console.log("loading /teacher/home/" + user.GetID());
    let teacherPage = util.GenerateHTMLHeader();
    teacherPage += GenerateTeacherPageHead();
    teacherPage += GenerateTeacherBody(user);
    teacherPage += util.GenerateHTMLFooter();
    return teacherPage; 
}

function LoadTeacherClientSideJs(user, studentIDs, hostname, port)
{
    console.log("loading /teacher/TeacherClientSide.js/" + user.GetID());
    let srcCode = "const studentIDs = [" + studentIDs.join() + "];\n";
    srcCode += util.GenerateClientSideFunctionSendPostForm(hostname, port) + "\n\n";
    srcCode += 
        `function GenerateMaxGradeRow(numQuestions)
        {
            let htmlStr = "";
            htmlStr += "<tr><th>Max Grade For Each Question</th>";
            for (let i = 0; i < numQuestions; i++)
            {
                htmlStr += "<td><input type = \\"number\\" name = \\"cells\\"/></td>";
            }
            htmlStr += "</tr>";
            return htmlStr;
        }
    
        function GenerateStudentRows(numQuestions)
        {
            let htmlStr = "";
            studentIDs.forEach(function (id)
            {
                htmlStr += "<tr><th>" + id + "</th>";
    
                for (let i = 0; i < numQuestions; i++)
                {
                    htmlStr += "<td><input type = \\"number\\" name = \\"cells\\"/></td>";
                }
    
                htmlStr += "</tr>";
            });
            return htmlStr;
        }
    
        function ValidateInput(tableDiv, numQuestions)
        {
            let assessmentName = document.getElementById("assessmentName").value;
            let assessmentWeight = document.getElementById("weight").value;

            if (assessmentName == "" || assessmentName == undefined)
            {
                tableDiv.innerHTML = "<p>Please fill in the name field for the assessement</p>";
                return false;
            }

            if (assessmentWeight == "" || assessmentWeight == undefined || assessmentWeight <= 0)
            {
                tableDiv.innerHTML = "<p>Please give a positive non zero weight for the assessement</p>";
                return false;
            }

            if (assessmentWeight > 100)
            {
                tableDiv.innerHTML = "<p>The assessment weight cannot exceed 100%</p>";
                return false;
            }

            if (numQuestions == undefined || numQuestions == "" || numQuestions == 0)
            {
                tableDiv.innerHTML = "<p>Please specify the number of questions for the assessement</p>";
                return false;
            }

            return true;
        }

        function GenerateAssessmentGradeTable()
        {
            let numQuestions = document.getElementById("numQuestions").value;
            let tableDiv = document.getElementById("questionTable");

            if (!ValidateInput(tableDiv, numQuestions))
            {
                return;
            }
    
            let divStr = "<table>";
            divStr += GenerateMaxGradeRow(numQuestions);
            divStr += GenerateStudentRows(numQuestions);
            divStr += "</table>";
            divStr += "<br/><button type = \\"button\\" onclick = \\"SubmitCreateAssessmentForm();\\">` 
                + `Save Assessment</button>";
            tableDiv.innerHTML = divStr;
        }
        
        function SubmitCreateAssessmentForm()
        {
            let formData = 
            {
                name: document.getElementById("assessmentName").value,
                weight: document.getElementById("weight").value,
                numQuestions: document.getElementById("numQuestions").value,
                formType: "assessmentCreation",
                id: `+ user.GetID() +`,
                gradesTable: "["
            };

            let table = document.getElementsByName("cells");
            let grades = new Array();

            table.forEach(function (item, key)
            {
                if (item.value == "" || item.value == undefined)
                {
                    grades.push(0);
                }
                else
                {
                    grades.push(item.value);
                }
            });

            let maxGrade = new Array();
            for (let i = 0; i < formData.numQuestions; i++)
            {
                maxGrade.push(grades.at(i));
            }
            formData.gradesTable += "{\\\"key\\\": \\\"maxGrade\\\", \\\"value\\\": [" + maxGrade.join() + "]},";

            let index = 0;
            while (index < studentIDs.length)
            {
                let studentGrades = new Array();
                for (let i = 0; i < formData.numQuestions; i++)
                {
                    studentGrades.push(grades.at(i + ((index + 1) * formData.numQuestions)));
                }
                formData.gradesTable += "{\\\"key\\\":" + studentIDs.at(index) 
                    + ", \\\"value\\\":[" + studentGrades.join() + "]}";
                if (index != studentIDs.length - 1)
                {
                    formData.gradesTable += ",";
                }
                index++;
            }
            formData.gradesTable += "]";

            SendFormPost(formData, function(event)
            {
                document.getElementById("gradeTable").innerHtml = "<p>Assessment Created</p>";
            });
        }`;
    return srcCode;
}

module.exports = { LoadTeacherHomePage, LoadTeacherClientSideJs, LoadTeacherLetterGrade };
