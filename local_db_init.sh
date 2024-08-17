#!/bin/bash
set -x
echo "DB name: $DYNAMODB_TABLE_NAME"

endpointUrl="http://127.0.0.1:8000"
echo "docker ps -a | grep $DYNAMODB_TABLE_NAME | wc -l"
if [ $( docker ps -a | grep $DYNAMODB_TABLE_NAME | wc -l ) -gt 0 ]; then
  echo "'$DYNAMODB_TABLE_NAME' exists."
  if [ "$( docker container inspect -f '{{.State.Status}}' $DYNAMODB_TABLE_NAME )" = "running" ]; then
    echo "Database container is running."
  elif [ "$( docker container inspect -f '{{.State.Status}}' $DYNAMODB_TABLE_NAME )" = "exited" ]; then
    echo "Database container is exited. Restarting..."
    docker start $DYNAMODB_TABLE_NAME
  else
    echo "Database container is in an unexpected state:"
    echo "$( docker container inspect -f '{{.State.Status}}' $DYNAMODB_TABLE_NAME )"
    exit 1
  fi
else
  echo "'$DYNAMODB_TABLE_NAME' does not exist, Building '$DYNAMODB_TABLE_NAME' Docker instance..."
  docker build -t $DYNAMODB_TABLE_NAME .
  docker run -d --name $DYNAMODB_TABLE_NAME -p 8000:8000 -v dynamodb-local:/home/dynamodblocal/db $DYNAMODB_TABLE_NAME
  docker stop $DYNAMODB_TABLE_NAME
  docker start $DYNAMODB_TABLE_NAME
  echo "Build complete."
fi

echo "aws dynamodb list-tables --endpoint-url $endpointUrl | grep $DYNAMODB_TABLE_NAME | wc -l"
if [ $( aws dynamodb list-tables --endpoint-url $endpointUrl | grep $DYNAMODB_TABLE_NAME | wc -l ) -gt 0 ]; then
  echo "'$DYNAMODB_TABLE_NAME' table already exists. Exiting..."
  exit 1
else
  echo "'$DYNAMODB_TABLE_NAME' table does not exist. Creating '$DYNAMODB_TABLE_NAME'..."
  aws dynamodb create-table \
      --endpoint-url $endpointUrl \
      --table-name $DYNAMODB_TABLE_NAME \
      --attribute-definitions \
          AttributeName=PK,AttributeType=S \
          AttributeName=SK,AttributeType=S \
          AttributeName=GSI1PK,AttributeType=S \
          AttributeName=GSI1SK,AttributeType=S \
      --key-schema \
          AttributeName=PK,KeyType=HASH \
          AttributeName=SK,KeyType=RANGE \
      --provisioned-throughput \
          ReadCapacityUnits=10,WriteCapacityUnits=5 \
      --global-secondary-indexes \
          "[
              {
                  \"IndexName\": \"GSI1\",
                  \"KeySchema\": [
                      {\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},
                      {\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}
                  ],
                  \"Projection\": {
                      \"ProjectionType\":\"ALL\"
                  },
                  \"ProvisionedThroughput\": {
                      \"ReadCapacityUnits\": 10,
                      \"WriteCapacityUnits\": 5
                  }
              }
          ]"
  echo "Creation complete. Exiting..."
fi

set +x