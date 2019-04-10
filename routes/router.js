const express = require('express');
const router = express.Router();
const cmd = require('node-cmd');
const IcontFont = require('../models/icon-font');
const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');
const rimraf = require('rimraf');
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
        console.log(req.files);

        cmd.get('icon-font-generator uploads/*.svg -o out', (err, data) => {
            console.log("The current working directory : " + data);

            copydir('uploads/', 'archive/', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('ok');
                }

                fs.readFile('out/icons.json', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let arr = [];
                        let Obj = JSON.parse(data);
                        Object.keys(Obj).forEach(ele => {
                            arr.push({
                                location: `archive/${ele}.svg`,
                                filename: `${ele}.svg`,
                                classname: `icon-${ele}`
                            })
                        })
                        var year = [];
                        arr.forEach(Element=> {
                            year.push({ updateOne : {
                                "filter" : { "classname" : Element.classname },
                                "update" : { $set : Element },
                                "upsert": true
                             } })     
                        })
                        console.log(JSON.stringify(year));
                        IcontFont.bulkWrite(year);
                    }
                    rimraf('uploads/*', () => {
                        console.log('done');
                    });
                });
            });
        });
    });

module.exports = router;
