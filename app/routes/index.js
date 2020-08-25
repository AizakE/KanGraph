var express = require('express');
var router = express.Router();
var GetShipInfo = require('./GetShipInfo.js');

// デフォルトでfaviconを取得するgetが発生するので、catchする
router.get('/favicon.ico', (req, res) => res.status(204));

// IDが指定されている場合
router.get('/result', function(req, res, next) {
  service = new GetShipInfo.GetShipInfo();
  res.render('index', {
    bannerName: service.getBannerName(req.query.params),
    jsonStatus: service.getJson(req.query.params),
    jsonShipList: service.getShipList()
    });
});

// 初期表示
router.get('/', function(req, res, next) {
  service = new GetShipInfo.GetShipInfo();
  res.render('index', {
    bannerName: '',
    jsonStatus: '',
    jsonShipList: service.getShipList()
    });
});

module.exports = router;
