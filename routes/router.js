const express = require('express');
const router = express.Router();
const cmd = require('node-cmd');
const fs = require('fs');
const IcontFont = require('../models/icon-font');
const copydir = require('copy-dir');
const multer = require('multer');
const bodyparser = require('body-parser');

router.use(bodyparser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname.toLowerCase()).replace(/_/g, "-"));
    }
});

var upload = multer({ storage: storage });

router.route('/upload')
    .post(upload.array('files'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(req.files);
        // console.log(req.files);

        cmd.get('icon-font-generator uploads/*.svg -o out -s', (err, data) => {
            console.log("The current working directory : " + data);
        });

        copydir('uploads/', 'archive/', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('ok');
            }
        });

        fs.readFile('out/icons.json','utf-8',(err,data)=>{
            if(err){
                console.log(err);
            }else{
                let arr = [];
                let Obj = JSON.parse(data);
                console.log(Obj);
                Object.keys(Obj).forEach(ele =>{
                    arr.push({
                        location:`archive/${ele}.svg`,
                        iconname:`icon-${ele}`,
                        classname:`${ele}.svg`
                    })
                })
                console.log(arr);
                    IcontFont.insertMany(arr);
            }
        })
    });

module.exports = router;
