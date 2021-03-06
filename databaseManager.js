'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'samRequirementOrder';

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveItem = item => {
	const params = {
		TableName: TABLE_NAME,
		Item: item
	};

	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return item.itemId;
		});
};

module.exports.getItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: TABLE_NAME
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};


module.exports.getAllItems = () => {
	const params = {
		TableName: TABLE_NAME
	};
	return dynamo
		.scan(params).promise();
};

module.exports.deleteItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: TABLE_NAME
	};

	return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId,body) => {

	const params = {
		TableName: TABLE_NAME,
		Key: {
			itemId
		},
		ConditionExpression: 'attribute_exists(itemId)',
		UpdateExpression: 'set applicant=:ap, area=:a, occupation=:o, dateRegister=:dr, minombre=:r',
		ExpressionAttributeValues: {
			":ap" : body.applicant,
			":a" : body.area,
			":o": body.occupation,
			":dr": body.dateRegister,
			":r": body.minombre
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};
