import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";

export class UserService {
  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-2',
      endpoint: 'http://localhost:8000'
    });
    this.tableName = process.env.DYNAMODB_TABLE_NAME!;
  }

  create = async (createParams: iCreate) => {
    const id = ulid();
    // This example adds a new item to the Music table.
    const input = {
      "Item": {
        "PK": { "S": "USER" },
        "SK": { "S": `USER#${createParams.email}` },
        "id": { "S": id },
        "last_name": { "S": createParams.last_name },
        "first_name": { "S": createParams.first_name },
        "email": { "S": createParams.email }
      },
      "TableName": this.tableName
    };

    const command = new PutItemCommand(input);
    const response = await this.client.send(command);
  }

  getList = async () => {
    const input = {
      "ExpressionAttributeValues": {
        ":PK": {
          "S": "USER"
        },
        ":SK": {
          "S": "USER#"
        }
      },
      "KeyConditionExpression": "PK = :PK AND begins_with(SK, :SK)",
      "TableName": this.tableName
    };
    const command = new QueryCommand(input);
    const response = await this.client.send(command);

    return response;
  }

  getByEmail = async (email: string) => {
    const input = {
      "Key": {
        "PK": {
          "S": "USER"
        },
        "SK": {
          "S": `USER#${email}`
        }
      },
      "TableName": this.tableName
    };
    const command = new GetItemCommand(input);
    const response = await this.client.send(command);

    return response;
  }

  update = async (record: any, updateParams: iUpdate) => {
    console.log('ALEX-TODO - user.service - record:', record);
    const input = {
      "ExpressionAttributeNames": {
        "#last_name": "last_name",
        "#first_name": "first_name",
        "#email": "email"
      },
      "ExpressionAttributeValues": {
        ":last_name": {
          "S": updateParams.last_name
        },
        ":first_name": {
          "S": updateParams.first_name
        },
        ":email": {
          "S": updateParams.email
        }
      },
      "Key": {
        "PK": record.Item.PK,
        "SK": record.Item.SK
      },
      "TableName": this.tableName,
      "UpdateExpression": "SET #last_name = :last_name, #first_name = :first_name, #email = :email"
    };
    const command = new UpdateItemCommand(input);
    const response = await this.client.send(command);

    return response;
  }
}

interface iCreate {
  last_name: string;
  first_name: string;
  email: string;
}

interface iUpdate {
  last_name: string;
  first_name: string;
  email: string;
}
