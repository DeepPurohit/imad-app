var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;


var config = {
    user : 'purohitdeep05',
    database : 'purohitdeep05',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles= {
    'article-one' : {
        title: 'Article one | Deep Purohit',
        heading: 'Article one',
        date: '19th Feb, 18',
        content: `
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                     <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                    
                     <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>`
                    },
                    
    'article-two' : {
        title: 'Article two | Deep Purohit',
        heading: 'Article two',
        date: '19th Feb, 18',
        content: `
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>`
                    },
                    
    'article-three' : {
        title: 'Article three | Deep Purohit',
        heading: 'Article three',
        date: '19th Feb, 18',
        content: `
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>`
                    },
};

function createTemplate(data){

var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;

var htmlTemplate = 
            `<html>
            <head>
                <title>${title}</title>
                <meta name="viewport" content="width=device-width , initial-scale=1"/>
                <link rel="stylesheet" href="/ui/style.css">
            </head>
            
            <body>
                    <div style="text-align:center">
                        <a href="/">Home</a>
                    </div>
                    <hr/>
                <div class="container">   
                    <h2>${heading}</h2>
                    
                    <div>
                        ${date.toDateString()}
                    </div>
                    
                    <div>
                       ${content}
                    </div>
                </div>
            </body>
            
        </html>
            `;
            
            return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function(req, res){
    pool.query('Select * FROM test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/article/:articleName', function(req, res){
    
    var articleName = req.params.articleName;
    //var articleData = ;
    pool.query("SELECT * FROM article WHERE title = '"+req.params.articleName + "'", function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else {
            if(result === 0){
                res.status(404).send('Article not found');
            }
            
            else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

var counter = 0;
app.get('/counter', function(req, res){
    counter+=1;
    res.send(counter.toString());
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
