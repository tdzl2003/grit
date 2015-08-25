/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var co = require("co");

function *worker(read, write, processor){
    function writeP(data){
        return new Promise((resolve, reject)=>{
            write(data, (err, result)=>{
                err ? reject(err):resolve(result);
            })
        })
    }
    for(;;){
        var req = yield read;
        // execute processor and wait for it to finish.
        // processor should return a promise.
        yield processor(req, writeP);
    }
}

function rpc1by1(read, write, processor){
    return co(worker(read, write, processor));
}

module.exports = rpc1by1;
