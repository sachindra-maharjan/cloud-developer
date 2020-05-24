import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { existsTodoId, httpResponse } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTableName = process.env.TODOS_TABLE

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info(event)

  const todoId = event.pathParameters.todoId
  logger.info(todoId)

  const isValidTodoId = await existsTodoId(docClient, todoTableName, todoId)

  if (!isValidTodoId) {
    return httpResponse(404, 'Todo item not found.')
  }

  const deletedItem = await deleteTodoItem(todoId)

  if (deletedItem == 'error') {
    return httpResponse(400, 'Failed to update todo item.')
  } else {
    return httpResponse(200, 'Deleted successfully.')
  }
}

async function deleteTodoItem(todoId: string) {
  var params = {
    TableName: todoTableName,
    Key: {
      todoId: todoId
    }
  }

  const deleteTodoPromise = docClient.delete(params).promise()

  const result = await deleteTodoPromise.then(
    function (data) {
      logger.info('Deleted todo item' + todoId)
      logger.info(data)
      return 'success'
    },
    function (error) {
      logger.info('Delete failed for todo item' + todoId)
      logger.info(error)
      return 'error'
    }
  )
  return result
}
