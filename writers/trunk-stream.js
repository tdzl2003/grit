/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var stream = require('stream');

function TrunkStream(write){
    function createStream(_, cb){
        let ret = new stream.Writable({
            write: function(chunk, encoding, next) {
                write(chunk, next);
            }
        });
        ret.once('finish', ()=>{
            write(null, cb);
        });

        return ret;
    }
    return createStream;
}

module.exports = TrunkStream;
