package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	kafka "github.com/segmentio/kafka-go"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GameLog struct {
	RequestNumber int    `json:"request_number"`
	Game          int    `json:game`
	GameName      string `json:gamename`
	Winner        string `json:winner`
	Players       int    `json:players`
}

func getKafkaReader(kafkaURL, topic string) *kafka.Reader {
	brokers := strings.Split(kafkaURL, ",")
	return kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		Topic:    topic,
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
}

func insertMongo(data GameLog) {
	mongo_url := "35.185.104.25"
	mongo_port := "27017"
	mongo_database := "proyecto2"
	mongo_collection := "logs"

	uri := fmt.Sprintf("mongodb://%s:%s/%s", mongo_url, mongo_port, mongo_database)

	client, err := mongo.NewClient(options.Client().ApplyURI(uri))

	if err != nil {
		log.Fatal(err)
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)

	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database(mongo_database).Collection(mongo_collection)

	doc := []interface{}{
		bson.M{
			"request_number": data.RequestNumber,
			"game":           data.Game,
			"gamename":       data.GameName,
			"winner":         data.Winner,
			"players":        data.Players,
			"worker":         "Kafka",
		},
	}

	res, insertErr := collection.InsertMany(ctx, doc)
	if insertErr != nil {
		log.Fatal(insertErr)
	}
	fmt.Println("Se inserto el log exitosamente")
	fmt.Println(res)
}

func main() {
	// get kafka reader using environment variables.
	kafkaURL := "localhost:29092"
	topic := "kafka1"

	reader := getKafkaReader(kafkaURL, topic)

	defer reader.Close()

	fmt.Println("Consumidor Iniciado ... !!")
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Fatalln(err)
		}
		data := GameLog{}
		json.Unmarshal([]byte(string(m.Value)), &data)
		insertMongo(data)
	}
}
