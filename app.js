const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = "3000";
//day.jsをimportするためのもの
// const data = require(__dirname + "/day.js");
const mongoose = require("mongoose");

app.listen(server, function () {
    console.log("the server is running now");
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

//データベースの作成 27017とは何か？ 答え:mongoDBの初期設定のこと
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

//MongoDBの作成の流れ
//スキーマ→モデルの作成と接続→コレクションの作成→コレクションの保存

//スキーマ（設計図）の指定と型指定
const itemsSchema = new mongoose.Schema({
    name: String,
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema],
});

//モデルとコレクションの作成 定数Itmeはモデル。
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

//コレクションに値を代入
const item1 = new Item({
    name: "Udemyをやり切る",
});

const item2 = new Item({
    name: "仮説思考を手に入れる",
});

const item3 = new Item({
    name: "アプリを作成",
});


//コレクションの保存
const ItemArray = [item1, item2, item3];



//ejsを使用可能に
app.set('view engine', 'ejs');

//Routeに接続時
app.get("/", function (req, res) {
    Item.find({}, function (err, items) {

        if (items.length === 0) {

            Item.insertMany(ItemArray, function () {
                console.log("The insertMany was success");
            });
            res.redirect("/");
        } else {
            res.render("list", { titleName: "Today", ToDoContent: items });
        }
    });
});

//POSTされた時
app.post("/", function (req, res) {
    //inputとvalue属性はセット！！
    const listName = req.body.list;
    //ItemName型はString型になる
    const ItemName = req.body.newListItem;
    //コレクションに追加
    const item = new Item({
        name: ItemName,
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();//コレクションに保存
            res.redirect("/" + listName);
        });
    }
})

//削除
app.post('/delete', function (req, res) {
    const deleteID = req.body.checkbox;
    const titleName = req.body.title;
    console.log(titleName);

    if (titleName === "Today") {
        Item.findByIdAndRemove(deleteID, function () {
            console.log("Deleted");
            res.redirect("/");
        })
    } else {
        List.findOneAndUpdate({ name: titleName }, { $pull: { items: { _id: deleteID } } }, function (err, foundList) {
            res.redirect("/" + titleName);
        });
    }
});

//3000/:parameter
app.get('/:parameter', function (req, res) {
    const listItem = req.params.parameter;


    List.findOne({ name: listItem }, function (error, foundList) {
        if (!error) {
            if (!foundList) {
                const list = new List({
                    name: listItem,
                    items: ItemArray,
                });
                list.save();
                res.redirect("/" + listItem);
            } else {
                console.log("Exist");
                res.render("list", { titleName: foundList.name, ToDoContent: foundList.items });
            }
        } else {
            console.log("Error");
        }
    });
});


