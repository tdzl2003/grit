/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var stream = require('stream');
var process = require('process');

function TrunkStream(read){
    function createStream(cb){
        let rstream = new stream.Readable({
            read() {
                read().then(
                    data=>this.push(data),
                    err=>this.emit('error', err)
                );
            }
        });
        let ret = Promise.resolve(rstream);
        if (cb){
            ret.then((v)=> cb(null, v));
        }
        return ret;
    }
    return createStream;
}

module.exports = TrunkStream;
