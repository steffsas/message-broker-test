"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bullmq_1 = require("bullmq");
var redis_1 = __importDefault(require("../redis/redis"));
var sharePointQueue = new bullmq_1.Queue('SharePoint', { connection: redis_1.default });
exports.default = sharePointQueue;
