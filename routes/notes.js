require("dotenv").config();
const express = require("express")
const routes = express.Router()
const notesModel = require('../models/notesModel');
const jwt = require("jsonwebtoken")



function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization
    if (authHeader == undefined) {
        res.status(401).send({ error: "autherization failed" });
    }
    let token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.TOKEN_KEY, function (err, decoded) {
        if (err) {
            res.status(500).send("authentificatin failed")
        } else {
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
 *          title:
 *            type: string
 *            description: the notes title
 *          content:
 *            type: string
 *            description: the notes content  
 */

/**
 * @swagger
 * path:
 * /api/notes: 
 *   post:
 *     summery: create  notes
 *     description: this api is used to create data
 *     requestbody: 
 *           required: true
 *           content:
 *              application/json:
 *           schemas:
 *                 $ref: "#components/schemas/Notes"  
 *     respnoses:
 *      '200':
 *           description: create data successsfully 
 * 
  */


routes.post("/notes", function (req, res) {

    const notes = new notesModel({
        title: req.body.title,
        content: req.body.content
    })
    notes.save(function (err) {
        if (!err) {
            res.json("successfully insertion of data")
        } else {
            res.json(err)
        }


    });
});

/**
 * @swagger
 * path:
 * /api/notes: 
 *   get:
 *     summery: Get all notes
 *     description: this api is used to fetch data from mongoose database
 *     respnoses:
 *      '200':
 *           description: the list of notes 
 *           content: 
 *                 application/json:
 *                          schemas:
 *                              type: array
 *                              items: 
 *                                   $ref: "#components/schemas/Notes"
  */

routes.get("/notes", function (req, res) {

    notesModel.find(function (err, foundItems) {
        if (!err) {
            res.json(foundItems)
            console.log(foundItems)
        } else {
            res.json(err)
        }
    });
});
/**
 * @swagger
 * path:
 * /api/notes: 
 *   delete:
 *     summery: delete all notes
 *     description: this api is used to delete data from mongoose database
 *     respnoses:
 *      '200':
 *           description: data is deleted successfully 
 
  */

routes.delete("/notes", function (req, res) {

    notesModel.deleteMany(function (err) {
        if (!err) {
            res.json("deleted all notes successfullyy")
        } else {
            res.json(err)
        }
    });
});

/**
 * @swagger
 * path:
 * /api/notes/{noteTitle}: 
 *   get:
 *     summery: Get all notes
 *     description: this api is used to fetch data from mongoose database
 *     parameters:
 *         -in: path
 *         name: title
 *     required: true
 *     schemas:
 *           type: integer
 *     respnoses:
 *      '200':
 *           description: the list of notes 
 *           content: 
 *                 application/json:
 *                          schema:
 *                              type: array
 *                              items: "#components/schemas/Notes"
  */
routes.get("/notes/:noteTitle", function (req, res) {

    console.log(req.headers.authorization)
    notesModel.findOne({ title: req.params.noteTitle }, function (err, foundTitle) {

        if (!err) {
            res.json(foundTitle)
            console.log(foundTitle);
        } else {
            res.json("not found title")
        }
    });
});
/**
 * @swagger
 * path:
 * /api/notes/{notesTitle}: 
 *   put:
 *     summery: update  notes
 *     description: this api is used to update data
 *     parameters:
 *           -in: path
 *           name: id
 *     required: true
 *     schemas:
 *          type: integer
 *     requestbody: 
 *           required: true
 *           content:
 *              application/json:
 *           schemas:
 *                 $ref: "#components/schemas/Notes"  
 *     respnoses:
 *      '200':
 *           description: updated data successsfully 
*           content: 
 *                 application/json:
 *                          schema:
 *                              type: array
 *                              items: "#components/schemas/Notes"
 * 
  */
routes.put("/notes/:notesTitle", function (req, res) {
    notesModel.updateMany({ title: req.params.notesTitle }, { title: req.body.title, content: req.body.content }, function (err, foundUpdate) {
        if (!err) {
            res.json(foundUpdate)
        } else {
            res.json(err)
        }
    });
});

module.exports = routes;