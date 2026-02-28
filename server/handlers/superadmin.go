package handlers

import (
	"net/http"
	"server/config"
	"server/models"

	// "time"

	"github.com/gin-gonic/gin"
)

func GetAdmins(c *gin.Context){
	rows,err := config.DB.Query("SELECT userid,created_at FROM users WHERE role='admin'")
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	var Admins []models.UserResponse
	for rows.Next(){
		var a models.UserResponse
		rows.Scan(&a.UserId,&a.CreatedAt)
		Admins = append(Admins,a)
	}
	c.JSON(http.StatusOK,Admins)
}

func RemoveUserBySuperAdmin(c *gin.Context) {
	userid := c.Param("userid")

	result, err := config.DB.Exec(`DELETE FROM users WHERE userid = ? AND role IN ('user', 'admin')`,userid,)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
func ChangeUserRole(c *gin.Context){
	userid := c.Param("userid")

	var input struct {
		Role string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid Input"})
		return
	}
	if input.Role != "user" && input.Role != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be 'user' or 'admin'"})
		return
	}
	result ,err := config.DB.Exec(`UPDATE users SET role = ? WHERE userid = ? AND role IN ('user','admin')`,input.Role,userid)
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Erroe"})
		return
	}

	rowsAffected,err:=result.RowsAffected()	
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound,gin.H{"message":"User Not Found"})
		return
	}

	c.JSON(http.StatusOK,gin.H{"message":"User ROle Updated Successfully"})
}