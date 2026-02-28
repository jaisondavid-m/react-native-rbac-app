package routes

import(
	"server/handlers"
	"server/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine{
	r:=gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/register",handlers.Register)
	r.POST("/login",handlers.Login)

	// All users
	auth := r.Group("/")
	auth.Use(middlewares.Auth())
	auth.GET("/me", handlers.Me)
	auth.GET("/products", handlers.GetProducts)

	// both admin and superAdmin
	admin := auth.Group("/")
	admin.Use(middlewares.AdminOrSuperAdmin())
	admin.POST("/product", handlers.AddProduct)
	admin.GET("/users", handlers.GetUsers)
	admin.DELETE("/user/:userid", handlers.RemoveUser)
	admin.DELETE("/product/:id",handlers.DeleteProduct)

	//only super admin
	super := auth.Group("/")
	super.Use(middlewares.IsSuperAdmin())
	super.GET("/admins", handlers.GetAdmins)
	super.DELETE("/user/:userid/force", handlers.RemoveUserBySuperAdmin)
	super.PUT("/user/:userid", handlers.ChangeUserRole)
	
	return r
}