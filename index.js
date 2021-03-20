const newman=require("newman");
const utils=require("./utils");

async function start()
{
    let args=process.argv;
    args.shift();
    utils.initWorkspace();
    args=utils.formatArgs(args);
    let newmanOptions=[];
    if (typeof(args.get("path2data"))==="string")
    {
        const individualIterationFiles=utils.splitIterationDataFile(args.get("path2data"));
        for (let file of individualIterationFiles)
        {
            const options={
                iterationData: file,
                collection: args.get("path2collection")
            };
            newmanOptions.push(options);
        }
    }
    else
    {
        newmanOptions.push({
            collection: args.get("path2collection")
        });
    }
    let list=new Array;
    for (let i=0;i<args.get("concurrency");i++)
    {
        list=[...list, ...newmanOptions];
    }
    newmanOptions=list;
    console.log(newmanOptions);
    let ps=new Array;
    for (let options of newmanOptions)
    {
        ps.push(new Promise((resolve)=>
        {
            newman.run(options, (err, sum)=>
            {

                utils.submitTestResult({error: err?true:false, content: err || sum}, args.get("save-individual-reports"));
                resolve();
            });
        }));
    }
    await Promise.all(ps);
    const report=utils.generateReport(args.get("path2collection"));
    utils.saveReport(report);

}


start();