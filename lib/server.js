/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

var net = require("net");
var StreamReader = require("../readers/stream-reader");

class Server
{
    constructor(options){
        this.options = options;

        this.listens = [];
        this.readerTransformers = options.readerTransformers || [options.readerTransformer];
        this.writerTransformers = options.writerTransformers || [options.writerTransformer];
        this.looper = options.looper;

        if (options.process) {
            this.process = options.process;
        }
    }
    listen(port, address){
        return new Promise((resolver, reject)=>{
            let server = net.createServer(c => this._onConnection(c));
            this.listens.push(server);

            server.on('error', e=> {
                reject && reject(e);
                this.removeListen(server);
            });
            server.listen(port, address, ()=>{
                reject = null;  // to release reference.
                resolver(server)
            });
        })
    }
    close(){
        this.listens.forEach(v=>v.close());
        this.listens = [];
    }
    removeListen(l){
        this.listens = this.listens.filter(v=>v!=l);
    }
    _onConnection(c){
        var reader = c;
        for (let i = 0; i < this.readerTransformers.length; i++){
            reader = this.readerTransformers[i](reader);
        }
        var writer = c;
        for (let i = 0; i < this.writerTransformers.length; i++){
            writer = this.writerTransformers[i](writer);
        }
        this.looper(reader, writer, (req, cb)=>this.process(req, cb))
            .catch(e=>{
                if (e.message != 'Stream closed') {
                    console.log(e.stack);
                }
                c.destroy();
            })
    }
    process(req, write){
        // do nothing
    }
}

module.exports = Server;