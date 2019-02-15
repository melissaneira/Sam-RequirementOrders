'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

exports.requirementsOrders = (event, context, callback) => {
	console.log("handleree");
	console.log(event);

	switch (event.httpMethod) {

		case 'DELETE':
			deleteItem(event, callback);
			break;
		case 'GET':
			getItem(event, callback);
			break;
		case 'POST':
			saveItem(event, callback);
			break;
		case 'PUT':
			updateItem(event, callback);
			break;
		default:
			sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
	}
};

function saveItem(event, callback) {

	//const timestamp = new Date().getTime();
	const item = JSON.parse(event.body);
	item.itemId = uuidv1();
	databaseManager.saveItem(item).then(response => {
		console.log(response);
		sendResponse(200, item.itemId, callback);
	});
}

function getItem(event, callback) {

	if(event.pathParameters){
		const itemId = event.pathParameters.itemId;
		console.log(itemId);
		databaseManager.getItem(itemId).then(response => {
			console.log(response);
			sendResponse(200, JSON.stringify(response), callback);
		});
	}
	else{
		databaseManager.getAllItems().then(response => {
			console.log( "ALL" + response);
			sendResponse(200, JSON.stringify(response), callback);
		});
	}
}

function deleteItem(event, callback) {
	const itemId = event.pathParameters.itemId;

	databaseManager.deleteItem(itemId).then(response => {
		sendResponse(200, 'DELETE ITEM', callback);
	});
}

function updateItem(event, callback) {
	console.log("Prbando funcion");
	console.log(event);
	console.log(event.body);
	const timestamp = new Date().getTime();
	const itemId = event.pathParameters.itemId;
	const body = JSON.parse(event.body);
	console.log(body);

	var requirementOrder = {
		"applicant" : body.applicant,
		"area": body.area,
		"occupation": body.occupation,
		"dateRegister": body.dateRegister,
		"minombre": body.minombre
	};
	console.log(requirementOrder);


	databaseManager.updateItem(itemId, requirementOrder).then(response => {

		console.log(response);
		//sendResponse(200, 'RO Updated', callback);
		sendResponse(200, itemId +" Actualizado", callback);
	});
}

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		headers: { "Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials" : true,
			"Content-Type": "application/json"},
		body: JSON.stringify(message)
	};
	callback(null, response);
}
