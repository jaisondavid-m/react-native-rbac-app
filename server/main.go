package main

import (
	"log"
	"server/config"
	"server/routes"
)

func main() {
	config.Connect()
	defer config.DB.Close()

	r := routes.SetUpRouter()

	if err := r.Run("0.0.0.0:8000"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}