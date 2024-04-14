package server

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/samarthasthan/plant-emotion/pkg/parameter"
)

type Server struct {
	ws *websocket.Conn
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) CreateRandomWS(w http.ResponseWriter, r *http.Request) {
	var upgrade = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	conn, err := upgrade.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalln(err)
	}

	s.ws = conn
	p := parameter.NewParameter()
	for {
		val := p.Random()
		s.ws.WriteJSON(val)
		// log.Printf("New parameter %+v pushed to WS", val)
		time.Sleep(time.Millisecond * 500)
	}
}
