help:
	@echo "    docker-compose-dev"
	@echo "        Deploy using docker-compose"
	@echo "    docker-compose-test"
	@echo "        Run tests in Docker"

docker-compose-dev:
	docker-compose up --build

docker-compose-test:
	docker-compose -f docker-compose.test.yml up --build
