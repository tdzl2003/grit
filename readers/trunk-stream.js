/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var stream = require('stream');

function TrunkStream(read){
    function createStream(_, cb){
        let ret = new stream.Readable({
            _read() {
                read(function(err, data){
                    if (err){
                        this.emit('error', err);
                    } else {
                        this.push(data);    //push null when empty packet received.
                    }
                })
            }
        });

        return ret;
    }
    return createStream;
}

module.exports = TrunkStream;
