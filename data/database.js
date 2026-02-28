import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

const connectionProtocol = process.env.MONGODB_CONNECTION_PROTOCOL;
const clusterAddress = process.env.MONGODB_CLUSTER_ADDRESS;
const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;

if (!connectionProtocol || !clusterAddress || !dbUser || !dbPassword || !dbName) {
  console.error("Missing MongoDB environment variables");
  process.exit(1);
}

const uri = `${connectionProtocol}://${dbUser}:${dbPassword}@${clusterAddress}/?retryWrites=true&w=majority`;

console.log("Trying to connect to db");
console.log('uri:', uri);
const client = new MongoClient(uri);

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log("Connected successfully to server");
} catch (error) {
  console.error("Connection failed:", error.message);
  await client.close();
  process.exit(1);
}

const database = client.db(dbName);

export default database;