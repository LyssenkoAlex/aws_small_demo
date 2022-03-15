const handlerDQL = require('../handler_dql');
const handlerDML = require('../handler_dml');


test('check getProductsList response', async () => {
    let expectedJson = {
        count: 2,
        description: "Product 2 description",
        id: "f6d593a0-4e46-4a77-9062-057a8645ace1",
        logo: "https://r2.readrate.com/img/pictures/basic/792/792600/7926008/w800h317-89405d1d.jpg",
        price: 2000,
        title: "Product 2"}

    let functionResponse = await handlerDQL.getAllProducts();
    expect(JSON.parse(functionResponse.body)[0]).toStrictEqual(expectedJson);
});

test('check getProductById response', async () => {
    let expectedJson = {
            count: 2,
            description: "Product 2 description",
            id: "f6d593a0-4e46-4a77-9062-057a8645ace1",
            logo: "https://r2.readrate.com/img/pictures/basic/792/792600/7926008/w800h317-89405d1d.jpg",
            price: 2000,
            title: "Product 2"}
    let functionResponse = await handlerDQL.getProductById({pathParameters:{productId:'f6d593a0-4e46-4a77-9062-057a8645ace1'}});
    expect(JSON.parse(functionResponse.body)[0]).toStrictEqual(expectedJson);
});

test('check create record', async () => {

    let functionResponse = await handlerDML.createProduct({body:JSON.stringify({price:'26',description:'test jest create', count:'2', title:'jest'})});
    expect(JSON.parse(functionResponse.body).message).toStrictEqual(
        "Record was created"
    );
});

test('check create record fails with Joi', async () => {

    let functionResponse = await handlerDML.createProduct({body:JSON.stringify({description:'test jest create', count:'0', title:'jest'})});
    console.log('functionResponse: ', functionResponse)
    expect(JSON.parse(functionResponse.body).message).toStrictEqual(
        "\"price\" is required"
    );
});


test('check delete record', async () => {

    let functionResponse = await handlerDML.createProduct({body:JSON.stringify({price:'26',description:'test jest delete', count:'0', title:'jest'})});
    const productId = JSON.parse(functionResponse.body).row_id;
    let deleteResponse = await handlerDML.deleteProduct({pathParameters:{productId:productId}});

    expect(JSON.parse(deleteResponse.body).message).toStrictEqual(
        "Record was deleted"
    );
});

test('check update record', async () => {

    let functionResponse = await handlerDML.createProduct({body:JSON.stringify({price:'26',description:'test jest create', count:'0', title:'jest'})});
    const productId = JSON.parse(functionResponse.body).row_id;
    let updateResponse = await handlerDML.updateProduct(
        {body:JSON.stringify({price:'26',description:'test jest create updated', count:'0', title:'jest', id:productId})});

    expect(JSON.parse(updateResponse.body).message).toStrictEqual(
        "Record was updated"
    );
});

