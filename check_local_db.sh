if [ "$( docker container inspect -f '{{.State.Status}}' validize-api-local )" = "running" ]; then
    echo "Database container is running."
    exit 0
else
    echo "Database container is not running."
    exit 1
fi