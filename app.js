
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const notesRouter=require("./routes/notes")
const userRoutes=require("./routes/user")
const swaggerUi=require("swagger-ui-express")
const swaggerjsdoc=require("swagger-jsdoc")



const options={
    definition:{
        openapi:"3.0.0",
      info:{
         title:"notes api",
         version:"1.0.0",
         desciption:"simple express library api",
      },  
      servers:[
          {
         url:"http://localhost:4000"
          }
        ],
       
    },
    apis:["./routes/notes.js"]
}
const specs=swaggerjsdoc(options)

const app = express()

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs))
mongoose.connect("mongodb+srv://shamseer:12345@cluster0.dtv82.mongodb.net/userDB", {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})




app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/api",notesRouter)
app.use("/api",userRoutes)




//middleware    



        




   app.listen("4000",function(){
       console.log("server is running port 4000")
   })
