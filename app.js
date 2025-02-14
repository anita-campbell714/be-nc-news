const express = require("express");
const {getTopics, getEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, addCommentToArticle, incrementVotes, removeCommentByCommentId, getAllUsers} = require("./controllers/controllers");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


// GET
app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

    // GET ARTICLES
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


    // GET USERS
app.get("/api/users", getAllUsers);



// POST
app.post("/api/articles/:article_id/comments", addCommentToArticle);


// PATCH
app.patch("/api/articles/:article_id", incrementVotes)


// DELETE
app.delete("/api/comments/:comment_id", removeCommentByCommentId)



// To capture all bad URLs
app.all("*", (request, response, next) => {
    response.status(404).send({    
        msg : "endpoint not found"
    });
});


// Error handling middleware
app.use((err, request, response, next) => {
    if(err.code === "22P02" || err.code ==="23502"){
        response.status(400).send({msg : "bad request"});
    }
    else if(err.code === "23503"){
        response.status(404).send({msg : "inputted username doesn't exist"})
    }
    else{ next(err) };
});

app.use((err, request, response, next) => {
    if(err.status && err.msg){
        response.status(err.status).send({msg : err.msg});
    }
    else{ next(err) };
})


module.exports = app;