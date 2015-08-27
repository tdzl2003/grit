/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

var net = require("net");
var events = require("events");
var StreamReader = require("../readers/stream-reader");

class Server extends events.EventEmitter
{
    constructor(options){
        super();
        this.options = options;

        this.listens = [];
        this.readerTransformers = options.readerTransformers || [options.readerTransformer];
        this.writerTransformers = options.writerTransformers || [options.writerTransformer];
        this.looper = options.looper;
        this._processing = 0;

        if (options.sessionFactory){
            this.sessionFactory = options.sessionFactory;
        }

        if (options.process) {
            this._process = options.process;
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

        var session = this.sessionFactory(reader, writer);
        this.looper(session, reader, writer, (sess, req, write)=>this.process(sess, req, write))
            .catch(e=>{
                if (e.message != 'Stream closed') {
                    console.log(e.stack);
                }
                c.destroy();
            })
    }
    process(sess, req, write){
        //TODO: limit max processnig request.
        console.log("jobStarted");
        this._processing ++;
        return this._process(sess, req, write).then(()=>{
            this.onJobDone();
        }).catch(e=>{
            console.error(e.stack);
            this.onJobDone();
        });
    }
    isIdle(){
        return this._processing == 0;
    }
    onJobDone(){
        console.log("jobDone");
        if (--this._processing == 0){
            this.emit('idle');
        }
    }
    _process(sess, req, write){
        return Promise.resolve();
    }
    sessionFactory(){
        return {};
    }
}

module.exports = Server;