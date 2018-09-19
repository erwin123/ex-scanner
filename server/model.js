var db = require('./dbconnection');
db.connect(db.trx,(done)=>{});

exports.getTglTesPeserta = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('select distinct DATE_FORMAT(peserta_tgl_test, "%Y %b %d") label,  DATE_FORMAT(peserta_tgl_test, "%Y-%m-%d") value from m_peserta', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getJamTesPeserta = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('select distinct peserta_waktu_test label, peserta_waktu_test value from m_peserta', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getLokasiPeserta = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('select distinct peserta_lokasi_test label, peserta_lokasi_test value from m_peserta', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAreaPeserta = function (location, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('select distinct peserta_area label, peserta_area value from m_peserta where peserta_lokasi_test = ?',location, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getColumnPeserta = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT COLUMN_NAME field, COLUMN_NAME header FROM INFORMATION_SCHEMA.COLUMNS WHERE  TABLE_NAME = 'm_peserta'", function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getPesertaByPass = function (crit, done) {
    let param =["%"+crit.loc+"%", "%"+crit.area+"%", "%"+crit.tgl+"%", "%"+crit.jam+"%"];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT peserta_id, peserta_code, peserta_gate, peserta_nama, peserta_birth, peserta_posisi, peserta_ktp, peserta_lokasi_test, peserta_tgl_test, peserta_waktu_test, peserta_photo, peserta_email, DATE_FORMAT(absen_masuk, '%Y-%m-%d %H:%i:%S') absen_masuk, absen_keluar, joblevel, peserta_area, absen_bypass, absen_lok_tgl_waktu FROM m_peserta where absen_lok_tgl_waktu like ? AND absen_lok_tgl_waktu like ? AND absen_lok_tgl_waktu like ?  AND absen_lok_tgl_waktu like ? AND absen_bypass = 1", param, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getPeserta = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT peserta_id, peserta_code, peserta_gate, peserta_nama, peserta_birth, peserta_posisi, peserta_ktp, peserta_lokasi_test, DATE_FORMAT(peserta_tgl_test, "%Y-%m-%d") peserta_tgl_test, peserta_waktu_test, peserta_photo, peserta_email, DATE_FORMAT(absen_masuk, "%Y-%m-%d %H:%i:%S") absen_masuk, absen_keluar, joblevel, peserta_area, absen_bypass, absen_lok_tgl_waktu FROM m_peserta', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getPesertaByCriteria = function (Peserta, done) {
    var wh = db.whereCriteriaGenerator(Peserta);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT peserta_id, peserta_code, peserta_gate, peserta_nama, peserta_birth, peserta_posisi, peserta_ktp, peserta_lokasi_test, DATE_FORMAT(peserta_tgl_test, "%Y-%m-%d") peserta_tgl_test, peserta_waktu_test, peserta_photo, peserta_email,  DATE_FORMAT(absen_masuk, "%Y-%m-%d %H:%i:%S") absen_masuk, absen_keluar, joblevel, peserta_area, absen_bypass, absen_lok_tgl_waktu FROM m_peserta'+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}


exports.updatePeserta = function (key, Peserta, done) {
    var values = [Peserta.absen_masuk, Peserta.absen_bypass, Peserta.absen_lok_tgl_waktu, key]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE m_peserta SET absen_masuk=?, absen_bypass=?, absen_lok_tgl_waktu=? WHERE peserta_code=? ', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}