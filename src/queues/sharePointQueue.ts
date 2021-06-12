import { Queue } from "bullmq"
import connection from "../redis/redis"

const sharePointQueue = new Queue('SharePoint', { connection });

export default sharePointQueue;