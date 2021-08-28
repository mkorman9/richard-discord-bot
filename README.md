https://www.sitepoint.com/discord-bot-node-js/

## Run

Prepare `.env` file in the same directory as docker-compose.yml file:
```
TOKEN=<OAuth2 token>
```

Run:
```
./start.sh
```

Get logs:
```
./logs.sh
```

Stop:
```
./stop.sh
```

Purge local database:
```
rm -rf .db/db.sqlite3
```
