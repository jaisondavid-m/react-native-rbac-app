package handlers

import (
	"net/http"
	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func AddProduct(c *gin.Context){
	var np models.Product

	if err := c.ShouldBindJSON(&np);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid Input"})
		return
	}
	
	_,err := config.DB.Exec("INSERT INTO products (product_name,product_price) VALUES (?,?)",np.Name,np.Price)

	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	c.JSON(http.StatusOK,gin.H{"message":"Product Added Successfully !"})
}
func DeleteProduct(c *gin.Context){
	id := c.Param("id")

	result,err := config.DB.Exec("DELETE FROM products WHERE id = ?",id)

	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	RowsAffected,err := result.RowsAffected()
	if err !=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	if RowsAffected == 0 {
		c.JSON(http.StatusNotFound,gin.H{"message":"Product Not Found"})
		return
	}
	c.JSON(http.StatusOK,gin.H{"message":"Product Deleted Successfully"})
}

func GetUsers(c *gin.Context){
	rows,err := config.DB.Query("SELECT userid,created_at FROM users WHERE role='user'")
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	var Users []models.UserResponse
	for rows.Next(){
		var u models.UserResponse
		err := rows.Scan(&u.UserId,&u.CreatedAt)
		if err!=nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan failed"})
			return
		}
		Users = append(Users, u)
	}
	c.JSON(http.StatusOK,Users)
}

func RemoveUser(c *gin.Context){
	userid := c.Param("userid")

	result,err := config.DB.Exec("DELETE FROM users WHERE userid = ? AND role = 'user'",userid)

	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	RowsAffected,err := result.RowsAffected()
	if err !=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	if RowsAffected == 0 {
		c.JSON(http.StatusNotFound,gin.H{"message":"User Not Found"})
		return
	}
	c.JSON(http.StatusOK,gin.H{"message":"User Deleted Successfully"})
}