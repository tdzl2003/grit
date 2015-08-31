/**
 * Created by tdzl2_000 on 2015-08-31.
 */
"use strict";

function StreamWriter(stream, maxBufSize){
    var buffering = 0;
    function write(buf, cb){
        let ret = new Promise((resolve,reject)=>{
            //TODO: length of string?
            var len = buf.length;
            if (buffering + len > maxBufSize){
                stream.destroy();
                return reject("Writing buffer overflow.");
            }
            buffering += len;
            stream.send(buf, err=>{
                buffering -= len;
                err?reject(err):resolve();
            });
        });
        if (cb){
            ret.then((v)=> cb(null, v), (e)=>cb(e));
        }
        return ret;
    }
    return write;
}
StreamWriter.wrap = function(maxSize){
    return s=>StreamWriter(s, maxSize);
}
module.exports = StreamWriter;