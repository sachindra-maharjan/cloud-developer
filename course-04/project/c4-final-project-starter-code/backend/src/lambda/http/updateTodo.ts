import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { existsTodoId, httpResponse } from '../utils'

const logger = createLogger('updateTodo')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTablename = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Event', event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info(todoId, updatedTodo)
  const isValidTodoId = await existsTodoId(docClient, todoTablename, todoId)

  if (!isValidTodoId) {
    return httpResponse(404, 'Todo item not found.')
  }

  const updateResult = await updateTodo(todoId, updatedTodo)

  if (updateResult == 'error') {
    return httpResponse(400, 'Failed to update todo item.')
  } else {
    return httpResponse(200, 'Update successfully.')
  }
}

async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest) {
  var params = {
    TableName: todoTablename,
    Key: {
      todoId: todoId
    },
    UpdateExpression: 'SET #nm = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ExpressionAttributeNames: {
      '#nm': 'name'
    },
    ReturnValues: 'UPDATED_NEW'
  }

  const result = await docClient
    .update(params)
    .promise()
    .then(
      function (data) {
        logger.info('Updated todo item' + todoId)
        logger.info(data)
        return 'success'
      },
      function (error) {
        logger.info('Update failed for todo item' + todoId)
        logger.info(error)
        return 'error'
      }
    )
  return result
}
