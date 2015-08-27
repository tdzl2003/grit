/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";

function UTFString(write){
    return function(str, cb){
        return write(new Buffer(str), cb);
    }
}

module.exports = UTFString;