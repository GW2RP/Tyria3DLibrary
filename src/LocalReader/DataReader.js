/*
Copyright © Tyria3DLibrary project contributors

This file is part of the Tyria 3D Library.

Tyria 3D Library is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Tyria 3D Library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with the Tyria 3D Library. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * TODO - doc
 */
class DataReader {
    constructor(settings){
        this._settings = settings;
        this._workerPool = [];
        this._workerLoad = [];
        this._inflateCallbacks = [];
        for (let i = 0; i<settings.workers; i++){
            this._startWorker(settings.path);
        }
    }

    /**
     * TODO doc
     * @param {*} ds 
     * @param {*} size 
     * @param {*} handle 
     * @param {*} isImage 
     * @param {*} capLength 
     * @param {null|ArrayBuffer} callback 
     */
    inflate(ds, size, handle, isImage, capLength, callback){
        let arrayBuffer = ds.buffer;

        //If no capLength then inflate the whole file
        if(!capLength || capLength < 0){
            capLength = 0;
        }

        //Buffer length size check
        if(arrayBuffer.byteLength < 12){
            T3D.Logger.log(
                T3D.Logger.TYPE_WARNING,
                `not inflating, length is too short (${arrayBuffer.byteLength})`, handle
            );
            callback(null);
            return;
        }

        // Register the callback
        if(this._inflateCallbacks[handle]){
            this._inflateCallbacks[handle].push(callback);
    
            ///No need to make another call, just wait for callback event to fire.
            return;
        }
        else{
            this._inflateCallbacks[handle] = [callback];	
        }

        // Add the load to the worker
        let workerId = this._getBestWorkerIndex();
        this._workerLoad[workerId] += 1;
        this._workerPool[workerId].postMessage(
            [handle, arrayBuffer, isImage===true, capLength]
        );
    }

    _startWorker(path){
        let self = this;
        let worker = new Worker(path);
        let selfWorkerId = this._workerPool.push(worker) - 1;
        if(this._workerLoad.push(0) != selfWorkerId + 1) 
            throw new Error("WorkerLoad and WorkerPool don't have the same length");

        worker.onmessage = function(message_event){
            let handle;
            // Remove load
            self._workerLoad[selfWorkerId] -= 1;

            // If error
            if( typeof message_event.data === 'string'){
                T3D.Logger.log(
                    T3D.Logger.TYPE_WARNING,
                    "Inflater threw an error", message_event.data
                );
                handle = message_event.data.split(':')[0];
                for(let callback of self._inflateCallbacks[handle]){
                    callback(null);
                }
            } 
            else {
                handle = message_event.data[0];
                // On success
                if(self._inflateCallbacks[handle]){
                    for(let callback of self._inflateCallbacks[handle]) {
                        let data = message_event.data;
                        // Array buffer, dxtType, imageWidth, imageHeigh			
                        callback(data[1], data[2], data[3], data[4]);	
                    }
                    // Remove triggered listeners
                    self._inflateCallbacks[handle] = null;
                } 
                
                // Unknown error
                else {
                    T3D.Logger.log(
                        T3D.Logger.TYPE_ERROR,
                        "Inflater threw an error", message_event.data
                    );
                }
            }

        };

    }

    _getBestWorkerIndex(){
        return this._workerLoad.indexOf(Math.min(...this._workerLoad));
    }

}

module.exports = DataReader;