package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
)

type Informacion struct {
	Request_Number int    `json:"request_number"`
	Game           int    `json:"game"`
	Gamename       string `json:"gamename"`
	Winner         string `json:"winner"`
	Players        int    `json:"players"`
	Worker         string `json:"worker"`
}

func HomeRoute(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	fmt.Println("PubSub worker Funciona")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "PubSub worker Funciona")

}

var ctx = context.Background()

func DBredis(data string) int {
	var addr = "34.71.214.209:6379"
	var password = ""
	c := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
	})
	p, err := c.Ping().Result()
	if err != nil {
		fmt.Println("redis kill")
		c.Close()
		return -1

	}
	fmt.Println(p)
	c.RPush("datos", data)
	//rs := c.LRange("datos", 0, 1000).Val()
	//fmt.Println(rs)
	c.Close()
	return 1
}
func EnviarDatos(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	var dato Informacion
	dato.Worker = "PubSub"
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "error de informacion")
		return
	}
	json.Unmarshal(reqBody, &dato)
	datoJson, err := json.Marshal(dato)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "error no se puedo decodifocar dato")
		return
	}

	var respuestaRedis = DBredis(string(datoJson))
	if respuestaRedis == -1 {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "error Redis no conectado")
		return
	}
	// aqui estara mongo db
	fmt.Println("dato Cargado")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(datoJson))
	return
}
func LimpiarLista(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	var addr = "34.71.214.209:6379"
	var password = ""

	c := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
	})
	c.Del("datos")
	c.Close()
	w.WriteHeader(http.StatusOK)
	fmt.Println("Base De Datos Limpia")
	fmt.Fprintf(w, "Base De Datos Limpia")

}
func VerDatos(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	var addr = "34.71.214.209:6379"
	var password = ""

	c := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
	})
	rs := c.LRange("datos", 0, 1000).Val()
	fmt.Println(rs)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, strings.Join(rs, " "))

}
func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", HomeRoute)
	router.HandleFunc("/datos", EnviarDatos).Methods("POST")
	router.HandleFunc("/limpiar", LimpiarLista).Methods("GET")
	router.HandleFunc("/verDatos", VerDatos).Methods("GET")
	log.Fatal(http.ListenAndServe(":4444", router))
}

// esta funcion sirve para poder mandar peticiones a angular ya que habilita los cors
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
