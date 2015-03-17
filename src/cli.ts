/// <reference path="./common/types.d.ts" />
/// <reference path="../typings/commander.d.ts" />

import fs = require("fs");
import program = require("commander");
import path = require("path");

import ProxyGenerator = require("./proxyGenerator");

program
    .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
    .usage('[options] [files]')
    .option('--recursive', 'include sub directories');

program.parse(process.argv);

var generator = new ProxyGenerator();
var options: any = program;

var args = program.args;
if(args.length == 0) {
    program.help();
    process.exit(0);
}

// get list of files
var files: string[] = [];
args.forEach((arg) => {
    findFiles(arg, options.recursive, files);
});
generator.files = files;

generator.run((err: Error) => {
    if(err) throw err;
    process.exit(0);
});

var filePattern = /\.d\.ts$/;

/**
 * Finds files for the given path.
 * @param filePath The path to search for.
 * @param recursive Indicates if the search should be recursive or not.
 * @param files List to add file path to.
 */
function findFiles(filePath: string, recursive: boolean, files: string[], depth = 0): void {

    if(path.basename(filePath)[0] === '.') return;

    if (!fs.existsSync(filePath)) {
        return findFiles(filePath + ".d.ts", recursive, files);
    }

    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
        if(filePattern.test(filePath)) {
            files.push(filePath);
        }
    }
    else if (stat.isDirectory() && (depth == 0 || recursive)) {
        var dirFiles = fs.readdirSync(filePath);
        for(var i = 0; i < dirFiles.length; i++) {
            findFiles(path.join(filePath, dirFiles[i]), recursive, files, depth + 1);
        }
    }
}