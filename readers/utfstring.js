/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";
function UTFString(read){
    return function(cb){
        read(function(buf){
            cb(buf.toString());
        })
    }
}
