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
 *    schemas:
 *       db:
 *        type: object
 *        properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         
 *       
 */

/**
 * @swagger
 * /api/notes:
 *  post:
 *    summary: add name to db
 *    security:
 *     - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/db'
 *    responses:
 *      200:
 *         description: saved
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/db'
 *      500:
 *         description: Some server error
 */


routes.post("/notes", function (req, res) {

    const notes = new notesModel({
        title: req.body.title,
        content: req.body.content
    })
    notes.save(function (err,data) {
        console.log(data)
        if (!err) {
            res.json("successfully insertion of data")
        } else {
            console.log(err)
            res.json(err)
        }


    });
});


/**
 * @swagger
 * /api/notes:
 *  get:
 *    summary: add name to db
 *    security:
 *     - jwt: []
 *    responses:
 *      200:
 *         description: saved
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/db'
 *      500:
 *         description: Some server error
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
 * /api/notes:
 *  delete:
 *    summary: delete all note in db
 *    security:
 *     - jwt: []
 *    responses:
 *      200:
 *         description: saved
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/db'
 *      500:
 *         description: Some server error
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
 * /api/notes/{notesTitle}:
 *  get:
 *    summary: add name to db
 *    security:
 *     - jwt: []
 *    parameters:
 *        - in: path
 *          name: notesTitle
 *          required: true 
 *          schemas:
 *             type: integer
 *    responses:
 *      200:
 *         description: saved
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/db'
 *      500:
 *         description: Some server error
 */

routes.get("/notes/:notesTitle", function (req, res) {

    console.log(req.headers.authorization)
    notesModel.findOne({ title: req.params.notesTitle }, function (err, foundTitle) {

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
 * /api/notes/{notesTitle}:
 *  put:
 *    summary: add name to db
 *    security:
 *     - jwt: []
 *    parameters:
 *        - in: path
 *          name: notesTitle
 *          required: true 
 *          schemas:
 *             type: integer
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/db'
 *    responses:
 *      200:
 *         description: saved
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/db'
 *      500:
 *         description: Some server error
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