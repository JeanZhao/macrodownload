const format = require("winston").format;
const winston = require('winston');

let fileFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.prettyPrint(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
let consoleFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.prettyPrint(),
    format.colorize(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
let transports = [];
const console = new winston.transports.Console({
    format: consoleFormat,
    level: 'debug',
});
transports.push(console);
winston.configure({
    transports
});

let md = require(`./dist/macrodownload.min`);

// update demo for modifying input box

test();

function test() {
    let te = new md.MacroDownload();
    const tasks = [{
        name: 'test link',
        menuList: [],
        downloadPath: './Test',
        downloadLink: [],
        macroId: 'q1'
    },
    ];
    te.runningSteam.subscribe(i => winston.warn(JSON.stringify(i)));

    te.download(tasks, {site: 'http://localhost:3000', launchOptions: {timeout: 60000}})
        .then(() => te.close());
}

