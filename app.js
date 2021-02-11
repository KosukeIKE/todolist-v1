const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = "3000";
const data = require(__dirname + "/day.js");


//配列コレクション

let workItem = [];

let list = [
    "EJSを学ぶ", 
    "Zoom Nodeを学ぶ",
];

app.listen(server, function () {
    console.log("the server is running now");
});



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');


app.get("/", function (req, res) {
    
    //今日の日付を取得している
    // let today = new Date();
    // let currentDay = today.getDay();
    // let day = "";
    // switch (currentDay) {
    //     case 0:
    //         day = "Sunday!!"
    //         break;
    //     case 1:
    //         day = "Monday!!"
    //         break;
    //     case 2:
    //         day = "Tuesday!!"
    //         break;
    //     case 3:
    //         day = "Wednesday!!"
    //         break;
    //     case 4:
    //         day = "Thursday!!"
    //         break;
    //     case 5:
    //         day = "Friday!!"
    //         break;
    //     case 6:
    //         day = "Saturday!!"
    //         break;
    //     default:
    //         console.log("Errorが表示されました");
    // }
    let day = data();//返り値を代入している。
    res.render("list", { titleName: day, ToDoContent: list });
});


app.post("/", function(req, res) {
    list.push(req.body.list);
    res.redirect("/");    
})


app.get('/work', function(req, res){
    res.render("list", {titleName: "Work Title", ToDoContent: workItem});
});

app.get('/about', function(req,res){
    res.render("about");
});


