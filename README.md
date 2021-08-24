https://www.sitepoint.com/discord-bot-node-js/

## Run

Prepare `.env` file in the same directory as docker-compose.yml file:
```
TOKEN=<OAuth2 token>
```

Run:
```
docker-compose up -d --build bot
```

Get logs:
```
docker-compose logs
```

Stop:
```
docker-compose down
```
