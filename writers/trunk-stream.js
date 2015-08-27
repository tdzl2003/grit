/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var stream = require('stream');

function TrunkStream(write){
    function createStream(_, cb){
        if (typeof(_) == 'function'){
            cb = _;
        }
        let wstream = new stream.Writable({
            write: function(chunk, encoding, next) {
                write(chunk, next);
            }
        });
        wstream.on('finish', function(){
            write(null);
        });
        let ret = Promise.resolve(wstream);
        if (cb){
            ret.then(v=>cb(null, v));
        }
        return ret;
    }
    return createStream;
}

module.exports = TrunkStream;
