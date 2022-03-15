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
export const getAllProducts = async (event) => {
    console.log('getAllProducts event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    try {
        const query = {text: `SELECT *  FROM products p`};
        const result = await client.query(query);
        console.log('vals: ', result.rows);
        return result.rows ? successResponse(result.rows, 200) : successResponse({ message: "No data from DB" }, 404 );
    }
    catch (error) {
        return errorResponse(error, 500)
    }
    finally {
        await client.end();
    }
};

export const getStockProducts = async (event) => {
    console.log('getStockProducts event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    try {
        const query = {text: `SELECT p.*, s.count FROM products p inner join stock s ON p.id = s.product_id where s.count  > 0`};
        const result = await client.query(query);
        console.log('vals: ', result.rows);
        return result.rows ? successResponse(result.rows, 200) : successResponse({ message: "No data from DB" }, 404 );
    }
    catch (error) {
        return errorResponse(error, 500)
    }
    finally {
        await client.end();
    }
};


export const getProductById = async (event) => {
    console.log('getProductById Lambda invocation with event: ', event);
    const client = new Client(dbOptions);
    await client.connect();

    try {

        if(event !== undefined && event.pathParameters !== undefined && event.pathParameters.productId !== undefined ) {
            const  productId  =  event.pathParameters.productId;
            const result = await client.query('SELECT p.* FROM products p  where p.id  = $1', [productId]);
            console.log('result: ', result)
            return result.rows.length === 1 ? successResponse(result.rows, 200) : successResponse({ message: "Product not found!!!" }, 404 );
        }
        else {
            return successResponse({ message: "Parameter is empty" }, 404 );

        }
    }
    catch (error) {
        return errorResponse(error, 500)
    }
    finally {
        await client.end();
    }
};
