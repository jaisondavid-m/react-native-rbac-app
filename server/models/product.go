package models

import(
	"time"
)

type Product struct{
	ID 			int 		`json:"id"`
	Name		string 		`json:"product_name"`
	Price		int 		`json:"product_price"`
	AddedAt 	time.Time 	`json:"added_at"`
}