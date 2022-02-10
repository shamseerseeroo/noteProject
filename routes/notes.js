require("dotenv").config();
const express=require("express")
const routes=express.Router()
const notesModel = require('../models/notesModel');
const jwt=require("jsonwebtoken")



function verifyToken(req,res,next){
    const authHeader=req.headers.authorization
    if(authHeader == undefined){
        res.status(401).send({error:"autherization failed"});
    }
    let token=authHeader.split(" ")[1]
    jwt.verify(token,process.env.TOKEN_KEY,function(err,decoded){
        if(err){
            res.status(500).send("authentificatin failed")
        }else{
            next()
         
    }
    })
}






/**
 * @swagger
 * components:
 *   schemas:
 *    Notes:
 *       type: object
 *       required:
 *          -title
 *          -content
 *       properties:
 *          id:
 *            type: string
 *            description:  users can create notes
 *          title:
 *            type: string
 *            description: the notes title
 *          content:
 *            type: string
 *            description: the notes content  
 *          examples:
 *           id: f3d_ers
 *           title: sample note title
 *           description: sample description
 * 
 */


routes.post("/notes",verifyToken,function(req,res){
    console.log(req.headers.authorization)
    const notes=new notesModel({
        title:req.body.title,
        content:req.body.content
    })
    notes.save(function(err){
        if(!err){
            res.json("successfully insertion of data")
        }else{
            res.json(err)
        }
        
        
    });
});

/**
 * @swagger
 * path:
 * /api/notes/: 
 *   get:
 *     summery: Get all notes
 *     resposes:
 *      '200':
 *       description: the list of notes    
  */

routes.get("/notes",verifyToken,function(req,res){
    console.log(req.headers.authorization)
    notesModel.find(function(err,foundItems){
      if(!err){  
        res.json(foundItems)
    }else{
        res.json(err)
    }
    });
});
routes.delete("/notes",verifyToken,function(req,res){
    
    notesModel.deleteMany(function(err){
        if(!err){
            res.json("deleted all notes successfullyy")
        }else{
            res.json(err)
        }
    });
});


routes.get("/notes/:noteTitle",verifyToken,function(req,res){
         
    console.log(req.headers.authorization)
    notesModel.findOne({title:req.params.noteTitle},function(err,foundTitle){
        
        if(!err){
            res.json(foundTitle)
            console.log(foundTitle);
        }else{
            res.json("not found title")
        }
    });
});
routes.put("/notes/:notesTitle",verifyToken,function(req,res){
    notesModel.updateMany({title:req.params.notesTitle},{title:req.body.title,content:req.body.content},function(err,foundUpdate){
        if(!err){
            res.json(foundUpdate)
        }else{
            res.json(err)
        }
    });
});

module.exports=routes;