package client

import (
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/samarthasthan/plant-emotion/pkg/parameter"
)

type Client struct {
	WS *websocket.Conn
}

func NewClient() *Client {
	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:3000/ws", nil)
	if err != nil {
		panic(err)
	}
	return &Client{WS: conn}
}

func (c *Client) Listen() {
	var p = parameter.Parameter{}
	for {
		c.WS.ReadJSON(&p)
		fmt.Println(&p)
	}
}
