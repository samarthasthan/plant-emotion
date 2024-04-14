package main

import (
	"log"
	"net/http"

	"github.com/samarthasthan/plant-emotion/internal/server"
)

func main() {

	sm := http.NewServeMux()
	s := server.NewServer()

	sm.HandleFunc("/ws", s.CreateRandomWS)
	log.Fatalln(http.ListenAndServe(":3000", sm))
}
