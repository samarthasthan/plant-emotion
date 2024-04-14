package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Parameter struct {
	Temperature    int     `json:"Temperature"`
	SoilMoisture   int     `json:"SoilMoisture"`
	LightIntensity int     `json:"LightIntensity"`
	Humidity       int     `json:"Humidity"`
	NutrientLevel  float32 `json:"NutrientLevel"`
	LeafMovement   int     `json:"LeafMovement"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool) // Connected clients
var broadcast = make(chan Parameter)         // Broadcast channel

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	// Add new client to clients map
	clients[conn] = true

	for {
		var param Parameter
		if err := conn.ReadJSON(&param); err != nil {
			log.Println("Error reading JSON:", err)
			delete(clients, conn)
			break
		}
		log.Printf("Received parameters: %+v", param)
		broadcast <- param
	}
}

func broadcastParameter() {
	for {
		// Get next parameter from broadcast channel
		param := <-broadcast

		// Send parameter to all connected clients
		for client := range clients {
			if err := client.WriteJSON(param); err != nil {
				log.Println("Error writing JSON to client:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	go broadcastParameter() // Start broadcasting loop

	http.HandleFunc("/ws", handleWebSocket)
	log.Println("WebSocket server running on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
