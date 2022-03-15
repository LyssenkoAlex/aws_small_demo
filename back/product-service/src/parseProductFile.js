import { S3Handler, S3Event } from "aws-lambda";
var AWS = require('aws-sdk');
import * as csvParser from "csv-parser";
import stream from 'stream';
import csv from 'csv-parser';
import {successResponse} from "./utils/responseBuilder";
import util from 'util';

AWS.config.update({region: 'eu-west-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const finished = util.promisify(stream.finished);

export const parseProductFile = async (event) => {
    const { REGION, SQS_URL } = process.env;
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const BUCKET = 'rsuploaded';

    console.log('parseProductFile event: ', event.pathParameters.file_name);
    const fileName = event.pathParameters.file_name;

    const products = [];
    const fileKey = `uploaded/${fileName}`;
    const s3Stream = s3.getObject({
        Bucket: BUCKET,
        Key: fileKey
    }).createReadStream();

    await finished(
        s3Stream.pipe(csv())
            .on('data', (data) => {
                console.log(data);
                products.push(data);
            }).on('end', async () => {
            await s3.copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${fileKey}`,
                Key: fileKey.replace('uploaded', 'parsed')
            }).promise();
        })
    )

    console.log('SQS_URL: ', SQS_URL)




    for(let i in products) {
        await  sqs.sendMessage({
                QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/312548907996/TestQQ',
                MessageBody: JSON.stringify(products[i])
            }
        ).promise();
    }

    return successResponse({text:'hello2'}, 200);

}
