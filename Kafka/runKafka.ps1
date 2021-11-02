docker-compose up -d;
docker exec kafka_kafka_1 kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic kafka1