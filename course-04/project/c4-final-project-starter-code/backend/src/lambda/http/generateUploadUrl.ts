import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const todoTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpirationTime = process.env.SIGNED_URL_EXPIRATION

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('generateUploadUrl', event)

  const todoId = event.pathParameters.todoId
  const validTodoId = await existsTodoId(todoId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Todo item does not exists.'
      })
    }
  }

  const uploadUrl = generateUploadUrl(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}

async function existsTodoId(todoId: string) {
  const result = await docClient
    .query({
      TableName: todoTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })
    .promise()
  logger.info('Todo item exists', result)

  return result.Count !== 0
}

function generateUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpirationTime
  })
}
