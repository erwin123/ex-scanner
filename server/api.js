var mdl = require('./model');

var express = require('express');
var router = express.Router();

//region peserta
router.post('/pesertabypass', function (req, res, next) {
    if (req.body) {
        mdl.getPesertaByPass(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.get('/pesertacolumn', function (req, res, next) {
    mdl.getColumnPeserta(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/peserta', function (req, res, next) {
    mdl.getPeserta(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/peserta/cr/', function (req, res, next) {
    if (req.body) {
        mdl.getPesertaByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.get('/tglpeserta', function (req, res, next) {
    mdl.getTglTesPeserta(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/jampeserta', function (req, res, next) {
    mdl.getJamTesPeserta(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/lokasipeserta', function (req, res, next) {
    mdl.getLokasiPeserta(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/areapeserta/:key', function (req, res, next) {
    mdl.getAreaPeserta(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.put('/peserta/:key', function (req, res, next) {
    mdl.updatePeserta(req.params.key, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

module.exports = router;