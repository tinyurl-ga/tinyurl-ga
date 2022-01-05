const express = require("express");
const crypto = require("crypto")
const Keyv = require('keyv');
const surl = new Keyv("sqlite://main.db", { table: "shorturl"});
const app = express();
const nunjucks = require('nunjucks');
const morgan = require('morgan');

app.use(morgan('combined'));
nunjucks.configure('html', {
    autoscape: true,
    express: app
});
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static('static'));

app.get("/", async function (req, res) {
    res.render("index.html")
});

app.get("/create", async function (req, res) {
    res.render("create.html");
});

app.post("/api", async function (req, res) {
    let result = await surl.get(req.body.url)
    if (result === undefined) {
        console.log(result);
        let name = crypto.randomBytes(5).toString('base64');
        await surl.set(name, req.body.url);
        res.json({"url": `https://tinyurl.ga/${name}`});
    } else {
        res.json({"url": `https://tinyurl.ga/${result}`});
    }
});

app.get("/:id", async function (req, res) {
    let url = await surl.get(req.params.id);
    if (url === undefined) {
        res.redirect("https://youtu.be/WqoMkpQWPQw");
    } else {
        res.redirect(url);
    }
});

app.use(function (req, res, next) {
    res.status(404).render("404.html")
});


app.listen(8080, function() {
    console.log("Ready!");
});