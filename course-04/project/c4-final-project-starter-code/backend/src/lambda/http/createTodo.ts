import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()

  const newItem = {
    todoId: todoId,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  await docClient
    .put({
      TableName: todoTable,
      Item: newItem
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}
