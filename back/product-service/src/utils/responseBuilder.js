

const defaultHeaders = {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

const successResponse = (body, statusCode )  => {

    return {
        statusCode,
        headers: {
            ...defaultHeaders
        },
        body: JSON.stringify( body )
    }
}

const errorResponse = ( err, statusCode ) => {

    return {
        statusCode,
        headers: {
            ...defaultHeaders
        },
        body: JSON.stringify( { message: err.message || 'Something went wrong !!!' })
    }
}

export { errorResponse, successResponse };
