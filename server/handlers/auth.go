package handlers

import (
	"os"
	"net/http"
	"server/config"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))
func Login(c *gin.Context){
	var input models.User

	if err:= c.ShouldBindJSON(&input); err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid Input Format"})
		return
	}

	var User models.User
	err := config.DB.QueryRow("SELECT id,userid,password,role FROM users WHERE userid=?",input.UserId).Scan(&User.ID,&User.UserId,&User.Password,&User.Role)

	if err!=nil{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"UserId Not Found"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(User.Password),[]byte(input.Password))

	if err!=nil{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"Incorrect Password"})
		return
	}

	expirationIime:=time.Now().Add(3*time.Hour)
	claims := &models.Claims{
		UserId: User.UserId,
		Role:   User.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationIime),
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	tokenstring,err := token.SignedString(jwtKey)
	
	if err!=nil{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"Unable to Generate Token"})
		return
	}

	c.JSON(http.StatusOK,gin.H{"message":"Logged In Successfully","token":tokenstring})
}

func Register(c *gin.Context){
	var input models.User
	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid Input"})
		return
	}

	var existingUser string
	err:=config.DB.QueryRow("SELECT userid FROM users WHERE userid=?",input.UserId).Scan(&existingUser)
	if err==nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"User Already Exists"})
		return
	}

	hashedpassword,err := bcrypt.GenerateFromPassword([]byte(input.Password),bcrypt.DefaultCost)

	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}

	_,err = config.DB.Exec("INSERT INTO users (userid,password,role) VALUES (?,?,?)",input.UserId,string(hashedpassword),"user",)
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Server Error"})
		return
	}
	c.JSON(http.StatusOK,gin.H{"message":"Registered Successfully"})
}

func Me(c *gin.Context){
	userid, _ := c.Get("userid")
	role, _ := c.Get("role")
	c.JSON(http.StatusOK, gin.H{
		"userid": userid,
		"role": role,
	})
}