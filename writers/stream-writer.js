/**
 * Created by tdzl2_000 on 2015-08-10.
 */
"use strict";

function StreamWriter(stream, maxBufSize){
    var buffering = 0;
    function write(buf, cb){
        var len = buf.length;
        if (buffering + len > maxBufSize){
            stream.destroy();
            return;
        }
        buffering += len;
        stream.write(buf, function(err){
            buffering -= len;
            cb && cb(err);
        });
    }
    return write;
}
StreamWriter.wrap = function(maxSize){
    return s=>StreamWriter(s, maxSize);
}
module.exports = StreamWriter;