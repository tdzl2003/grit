/**
 * Created by Yun on 2015-08-25.
 */
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
        // execute processor, but does not wait for it.
        // processor should return a promise.
        processor(req, writeP);
    }
}

function free(read, write, processor){
    return co(worker(read, write, processor));
}

module.exports = free;
