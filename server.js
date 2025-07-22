"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("zone.js/node");
var express_1 = require("express");
var path_1 = require("path");
var ssr_1 = require("@angular/ssr");
var main_server_1 = require("./src/main.server");
var common_1 = require("@angular/common");
var PORT = process.env['PORT'] || 4000;
var DIST_FOLDER = '/var/www/lucjaubert_c_usr14/data/www/lucjaubert.com/lucjaubert';
var engine = new ssr_1.CommonEngine();
var app = (0, express_1.default)();
app.get('*.*', express_1.default.static(DIST_FOLDER, {
    maxAge: '1y',
}));
app.get('*', function (req, res) {
    engine
        .render({
        bootstrap: main_server_1.default,
        documentFilePath: (0, path_1.join)(DIST_FOLDER, 'index.html'),
        url: req.originalUrl,
        publicPath: DIST_FOLDER,
        providers: [
            { provide: common_1.APP_BASE_HREF, useValue: req.baseUrl },
        ],
    })
        .then(function (html) { return res.status(200).send(html); })
        .catch(function (err) {
        console.error('Erreur lors du rendu SSR', err);
        res.status(500).send('Une erreur est survenue');
    });
});
app.listen(PORT, function () {
    console.log("Serveur Node \u00E9coutant sur http://localhost:".concat(PORT));
});
