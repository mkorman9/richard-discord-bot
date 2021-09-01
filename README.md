## Run

Prepare `config.yml` file in the same directory as docker-compose.yml:
```
cp config.yml.template config.yml

# Replace <Discord API Token> with a proper value of Discord API Token inside config.yml
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
