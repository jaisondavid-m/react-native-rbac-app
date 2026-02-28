package handlers

import(
	"net/http"
	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context){
	rows,err := config.DB.Query("SELECT id,product_name,product_price,added_at FROM products")
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed To Get Product Data"})
		return
	}
	var Products []models.Product
	for rows.Next(){
		var p models.Product
		rows.Scan(&p.ID,&p.Name,&p.Price,&p.AddedAt)
		Products = append(Products, p)
	}
	c.JSON(http.StatusOK,Products)
}