module.exports = [
    ///==================================================
    ///Chunk: txtm, versions: 1, strucTab: 0x13F0884     ///==================================================


    {
        name: 'txtm',
        versions: {


            // => Version: 0
            0: function() {
                this.TextPackLanguage = [
                    'filenames', Utils.getArrayReader(Utils.getFileNameReader()),
                ];

                this.__root = this.TextPackManifest = [
                    'stringsPerFile', 'uint32',
                    'languages', Utils.getArrayReader(this.TextPackLanguage),
                ];

            },
        }
    }


]