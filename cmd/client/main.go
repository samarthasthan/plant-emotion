package main

import "github.com/samarthasthan/plant-emotion/internal/client"

func main() {
	c := client.NewClient()
	c.Listen()
	defer c.WS.Close()
}
