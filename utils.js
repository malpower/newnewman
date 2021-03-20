const fs=require("fs");
const testResults=new Array;
const testItemResults=new Map;

function formatArgs(args)
{
    const formattedArgs=new Map;
    formattedArgs
        .set("path2collection", false)
        .set("concurrency", 1)
        .set("save-individual-reports", false)
        .set("path2data", false);
    for (let key of formattedArgs.keys())
    {
        for (let arg of args)
        {
            if (arg.indexOf(`--${key}=`)===0)
            {
                formattedArgs.set(key, arg.replace(`--${key}=`, ""));
            }
        }
    }
    formattedArgs.set("concurrency", Number.parseInt(formattedArgs.get("concurrency")));
    return formattedArgs;
}

function initWorkspace()
{
    if (!fs.existsSync(`.newnewman`))
    {
        fs.mkdirSync(`.newnewman`);
        return;
    }
    const s=fs.statSync(`.newnewman`);
    if (s.isDirectory())
    {
        return;
    }
    console.error("Failed to initialize workspace since .newnewman is not a directory, please try to remove the file and try again.");
    process.exit(1);
}


function splitIterationDataFile(ifile)
{
    if (!fs.existsSync(`.newnewman/ifiles`))
    {
        fs.mkdirSync(`.newnewman/ifiles`);
    }
    try
    {
        const ifiles=new Array;
        const data=JSON.parse(fs.readFileSync(ifile, "utf8"));
        for (let i=0;i<data.length;i++)
        {
            const item=[data[i]];
            const name=`${Date.now()}${Math.random()}.${i}`;
            fs.writeFileSync(`.newnewman/ifiles/${name}`, JSON.stringify(item));
            ifiles.push(`.newnewman/ifiles/${name}`);
        }
        return ifiles;
    }
    catch (e)
    {
        console.error(e.message);
        process.exit(1);
    }
}


function submitTestResult(result, needSaveIReport)
{
    if (needSaveIReport==="YES")
    {
        fs.writeFileSync(`.newnewman/${Date.now()}.json`, JSON.stringify(result));
    }
    if (result.error)
    {
        return;
    }
    for (let exe of result.content.run.executions)
    {
        const r={
            responseTime: exe.response.responseTime,
            requestData: exe.request.body,
            assertions: exe.assertions
        };
        let list=testItemResults.get(exe.item.name) || [];
        list.push(r);
        testItemResults.set(exe.item.name, list);
    }
    
}

function generateReport(collectionPath)
{
    let collection=fs.readFileSync(collectionPath, "utf8");
    collection=JSON.parse(collection);
    const report={
        items: []
    };
    for (let item of collection.item)
    {
        let results=testItemResults.get(item.name) || [];
        let r={
            name: item.name,
            avgTime: results.reduce((p, v)=>p+v.responseTime, 0)/results.length,
            requested: results.length,
            failed: results.filter(v=>v.assertions?.map(v=>!!v.error).includes(true)).length,
            maxTime: (results.sort((a, b)=>b.responseTime-a.responseTime)[0] || {responseTime: 0}).responseTime,
            minTime: (results.sort((a, b)=>a.responseTime-b.responseTime)[0] || {responseTime: 0}).responseTime,
            errors: results.filter(v=>v.assertions?.map(v=>!!v.error).includes(true)).map(v=>({assertions: v.assertions, requestBody: v.requestData}))
        };
        report.items.push(r);
    }

    return report;
}


function saveReport(report)
{
    fs.writeFileSync(`report.json`, JSON.stringify(report));
}



module.exports={
    formatArgs,
    initWorkspace,
    splitIterationDataFile,
    submitTestResult,
    generateReport,
    saveReport
};