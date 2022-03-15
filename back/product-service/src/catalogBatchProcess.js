import * as AWS from "aws-sdk";
import {productDataSchema} from "./utils/productSchema";
import {errorResponse, successResponse} from "./utils/responseBuilder";

const {Client} = require('pg')

const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = process.env;

const dbOptions = {
    host:PGHOST,
    port:PGPORT,
    user:PGUSER,
    database:PGDATABASE,
    password:PGPASSWORD,
    ssl: {
        rejectUnauthorized:false
    },
    connectionTimeoutMillis:5000
}


export const catalogBatchProcess = async (event) => {

    const messages = event.Records.map(async ({body}) =>  createProduct(body))
    console.log('message: ', messages);
}

const createProduct = async (event) => {

    console.log('createProduct event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    const {price, description, title, count} = JSON.parse(event);

        try {
            await client.query('BEGIN')
            const {rows} = await client.query(
                'INSERT INTO products(title, description, price, count) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, description, price, count]
            );

            return rows ? successResponse({
                message: 'Record was created',
                row_id: rows[0].id
            }, 200) : successResponse({message: "Error happened"}, 404);

        } catch (err) {
            await client.query('ROLLBACK')
            return errorResponse(err, 500)
        } finally {
            await client.end();
        }
}
