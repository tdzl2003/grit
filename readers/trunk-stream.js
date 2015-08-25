/**
 * Created by tdzl2_000 on 2015-08-13.
 */
"use strict";

var stream = require('stream');
var process = require('process');

function TrunkStream(read){
    function createStream(cb){
        let ret = new stream.Readable({
            read() {
                read((err, data)=>{
                    if (err){
                        this.emit('error', err);
                    } else {
                        this.push(data);    //push null when empty packet received.
                    }
                })
            }
        });
        //ret.on('end', ()=>cb());
        process.nextTick(()=>{
            cb(null, ret);
        })
    }
    return createStream;
}

module.exports = TrunkStream;
