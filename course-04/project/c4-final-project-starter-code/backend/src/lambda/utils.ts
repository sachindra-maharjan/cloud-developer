import { APIGatewayProxyEvent } from 'aws-lambda'
import { parseUserId } from '../auth/utils'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export async function existsTodoId(
  docClient: DocumentClient,
  tablename: string,
  todoId: string
) {
  const result = await docClient
    .query({
      TableName: tablename,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })
    .promise()
  return result.Count !== 0
}

export function httpResponse(status: number, message: any) {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message
    })
  }
}
