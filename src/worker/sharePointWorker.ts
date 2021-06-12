import { Job, Worker } from "bullmq"
import sharePointQueue from "../queues/sharePointQueue"

const MAX_SLEEP = 10; // seconds
const THROTTLING_PROBABILITY = 5;

const random = (max: number): number => {
    return Math.floor(Math.random() * max);
}

const sleep = async (seconds: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000)
    })
}

const simulateProgress = async (job: Job): Promise<void>  => {
    // simulate sharepoint request time
    const seconds = random(MAX_SLEEP) // seconds

    for(let i = 0; i<10; i++) {
        await sleep(seconds / 10)
        job.updateProgress(i * 10)
    }
}

const sharePointThrottled = (retryAfter: number) => {
    sharePointQueue.pause()
    setTimeout(() => {
        sharePointQueue.resume()
    }, retryAfter * 1000)
}

const sharePointWorker = new Worker(sharePointQueue.name, async(job) => {
    // simulate progress
    await simulateProgress(job)

    // simulate throttling with probability 1/5
    const seconds = random(THROTTLING_PROBABILITY)
    if(seconds === 1) {
        // we are throttled
        const retryAfter = random(60)
        sharePointThrottled(retryAfter)
        throw new Error("got throttled")
    }

    return "some data"
})

export default sharePointWorker;