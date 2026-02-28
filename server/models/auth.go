package models

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)


type User struct{
	ID			int		   	`json:"id"`
	UserId		string		`json:"userid"`
	Password	string 		`json:"password"`
	Role 		string 		`json:"role"`
	CreatedAt	time.Time 	`json:"created_at"`
}
type UserResponse struct{
	UserId		string		`json:"userid"`
	CreatedAt	time.Time 	`json:"created_at"`
}

type Claims struct {
	ID			int		`json:"id"`
	UserId		string	`json:"userid"`
	Role 		string 	`json:"role"`
	jwt.RegisteredClaims
}