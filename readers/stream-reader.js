/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function StreamReader(stream){
    var closed;
    var waiting = [];

    function onReadable(){
        let cb;
        while(waiting.length > 0){
            let data = stream.read();
            if (data != null){
                cb = waiting.shift();
                cb(null, data);
            } else {
                break;
            }
        }
    }
    function read(cb){
        if (closed){
            return cb(closed);
        }
        if (waiting.length){
            waiting.push(cb);
            return;
        }
        var data = stream.read();
        if (data){
            return cb(null, data);
        }
        waiting.push(cb);
        stream.once('readable', onReadable);
    }
    function onClose(){
        closed = closed || new Error("Stream closed");
        waiting.forEach(cb=>cb(closed));
        waiting = [];
    }
    stream.on('close', onClose);
    stream.on('error', onClose);
    return read;
}
module.exports = StreamReader;