import express from "express"

import sharePointQueue from "./queues/sharePointQueue"
import sharePointWorker from "./worker/sharePointWorker"

import prettyjson from "prettyjson"

const app = express();
const port = 8080; // default port to listen

app.get("/", async ( req, res ) => {
    let response = ""
    const jobs = await sharePointQueue.getJobs(['wait', 'delayed', 'active', 'completed', 'failed'])
    response += "jobs:<br>"
    jobs.forEach(job => {
        response += "<pre>"
        response += JSON.stringify(job);
        response += "</pre>";
    })
    response += "workers:<br>"
    response += sharePointWorker.name
    response += "<br>"
    response += "queue paused: " + await sharePointQueue.isPaused()
    res.send(response)
});

app.get("/add", async (req, res) => {
    const job = await sharePointQueue.add('request', {
        name: 'some job',
        data: 'some arbitrary data...'
    }, {
        attempts: 10,
        removeOnComplete: false
    })
    res.send(`Job scheduled with data ${job}!`)
})

app.get("/status", async (req, res) => {
    const id = req.query.id;
    if(id) {
        const log = await sharePointQueue.getJobLogs((id as string))
        res.send(JSON.stringify(log))
    } else {
        res.send("Please specify job id to get status!")
    }
})

app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
});