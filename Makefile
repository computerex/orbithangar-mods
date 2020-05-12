.PHONY: build start stop ngrok bash logs followlogs status test

build:
	docker-compose down
	docker-compose rm
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

ngrok:
	@echo "creating ngrok instance in the background"
	ngrok http -bind-tls=true 8066 > /dev/null &

bash-database:
	docker-compose exec ohm-database bash

bash-api:
	docker-compose exec ohm-api bash

logs:
	docker-compose logs rasa

followlogs:
	docker-compose logs -f rasa

status:
	docker-compose ps

test:
	$(WINPTY)docker-compose exec $(TTY_PARAM) rasa bash -c "python -m unittest discover -s spec/ -p '*.py'"