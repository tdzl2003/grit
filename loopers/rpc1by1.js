/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var co = require("co");

function *worker(read, write, processor){
    for(;;){
        var req = yield read;
        yield cb=>processor(req, function(err, resp){
            if (err){
                cb(err);
            } else {
                return write(resp, cb);
            }
        });
    }
}

function rpc1by1(read, write, processor){
    return co(worker(read, write, processor));
}

module.exports = rpc1by1;
