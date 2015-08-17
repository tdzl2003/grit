/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";
function UTFString(read){
    return function(cb){
        read(function(err, buf){
            if (err){
                cb(err);
            } else {
                cb(null, buf ? buf.toString(): "");
            }
        })
    }
}

module.exports = UTFString;