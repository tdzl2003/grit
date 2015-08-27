/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var co = require("co");

function *worker(sess, read, write, processor){
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
        yield processor(sess, req, writeP);
    }
}

function rpc1by1(sess, read, write, processor){
    return co(worker(sess, read, write, processor));
}

module.exports = rpc1by1;
