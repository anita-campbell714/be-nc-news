const db = require("../db/connection");

exports.fetchTopics = (request, response, next) => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics;
    });
};

exports.fetchArticleByID = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows})=> {
        if(rows.length === 0){
            return Promise.reject({
                status : 404,
                msg : `no article found with an article_id of ${article_id}`
            })
        }
        return rows[0]
    })
}


exports.fetchAllArticles = (request, response, next) => {
    return db.query(`
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM
            articles
        JOIN 
            comments ON articles.article_id = comments.article_id
        GROUP BY
            articles.article_id
        ORDER BY
            articles.created_at DESC
    `).then((body) => {
        body.rows.forEach((body) => {
            body.comment_count = Number(body.comment_count)
        })
        return body.rows;
    });
};