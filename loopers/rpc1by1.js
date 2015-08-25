/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var co = require("co");

function *worker(read, write, processor){
    for(;;){
        var req = yield read;
        yield * processor(req, function(data){
            return new Promise((resolve, reject)=>{
                write(data, (err, result)=>{
                    err ? reject(err):resolve(result);
                })
            })
        });
    }
}

function rpc1by1(read, write, processor){
    return co(worker(read, write, processor));
}

module.exports = rpc1by1;
