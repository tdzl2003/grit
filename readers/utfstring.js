/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";
function UTFString(read){
    return function(cb) {
        let ret = new Promise((resolve, reject)=> {
            read().then(
                buf=>resolve(buf ? buf.toString() : ""),
                reject)
        });
        if (cb) {
            ret.then((v)=> cb(null, v), (e)=>cb(e));
        }
        ret.then(v=>console.log(v));
        return ret;
    }
}

module.exports = UTFString;