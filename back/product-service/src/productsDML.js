import {errorResponse, successResponse} from "./utils/responseBuilder";
import {productDataSchema} from "./utils/productSchema";
const Joi = require('joi');

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


export const createProduct = async (event) => {

    console.log('createProduct event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    const {price, description, title, count} = JSON.parse(event.body);
    const result = productDataSchema.validate(JSON.parse(event.body));
    if(!result.error) {
        try {
            await client.query('BEGIN')
            const {rows} = await client.query(
                'INSERT INTO products(title, description, price, count) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, description, price, count]
            );
             await client.query(
                'INSERT INTO stock(product_id, count) VALUES ($1, $2) RETURNING *',
                [rows[0].id,  count]
            );
            await client.query('COMMIT')


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
    } else {
        console.log('result.error.details: ', result.error.details[0].message)
        return successResponse({message: result.error.details[0].message}, 400);
    }
}

export const updateProduct = async (event) => {

    console.log('updateProduct event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    const {id, price, description, title, count} = JSON.parse(event.body);
    try {
        const { rows } = await client.query(
            'update products set title = $1,  description = $2, price = $3, count = $4 where products.id = $5',
            [title, description, price, count, id]
        );
        console.log('rows: ', rows)
        return rows ? successResponse({message:'Record was updated'}, 200) : successResponse({ message: "Error happened" }, 404 );

    }
    catch (err) {
        return errorResponse(err, 500)
    }
    finally {
        await client.end();
    }
}

export const deleteProduct = async (event) => {

    console.log('deleteProduct event: ', event);
    const client = new Client(dbOptions);
    await client.connect();
    try {
        if(event !== undefined && event.pathParameters !== undefined && event.pathParameters.productId !== undefined ) {
            const  productId  =  event.pathParameters.productId;
            const {rows} = await client.query(
                'delete from products where products.id = $1',
                [productId]
            );
            console.log('rows: ', rows)
            return rows ? successResponse({message: 'Record was deleted'}, 200) : successResponse({message: "Error happened"}, 404);
        }
        else {

        }
    }
    catch (err) {
        return errorResponse(err, 500)
    }
    finally {
        await client.end();
    }
}
