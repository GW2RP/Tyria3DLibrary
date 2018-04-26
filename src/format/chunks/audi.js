var Utils = T3D.ParserUtils;

module.exports = [
    ///==================================================
    ///Chunk: audi, versions: 9, strucTab: 0x1580178 
    ///==================================================


    {
        name: 'audi',
        versions: {


            // => Version: 8
            8: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'filenameInterior', Utils.getFileNameReader(),
                    'exteriorVolume', 'float32',
                    'priority', 'uint32',
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                    'guid', Utils.getQWordReader(),
                    'flags', 'uint32',
                ];

                this.PackMapAudioRegionTool = [
                    'annotation', Utils.getString16Reader(),
                ];

                this.PackMapAudioDep = [
                    'dependency', Utils.getFileNameReader(),
                    'flags', 'uint32',
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                    'audioRegionTools', Utils.getArrayReader(this.PackMapAudioRegionTool),
                    'audioDepArray', Utils.getArrayReader(this.PackMapAudioDep),
                ];

            },

            // => Version: 7
            7: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'filenameInterior', Utils.getFileNameReader(),
                    'exteriorVolume', 'float32',
                    'priority', 'uint32',
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                    'guid', Utils.getQWordReader(),
                    'flags', 'uint32',
                ];

                this.PackMapAudioRegionTool = [
                    'annotation', Utils.getString16Reader(),
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                    'audioRegionTools', Utils.getArrayReader(this.PackMapAudioRegionTool),
                ];

            },

            // => Version: 6
            6: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'filenameInterior', Utils.getFileNameReader(),
                    'exteriorVolume', 'float32',
                    'priority', 'uint32',
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                    'guid', Utils.getQWordReader(),
                    'flags', 'uint32',
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 5
            5: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                    'guid', Utils.getQWordReader(),
                    'flags', 'uint32',
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 4, ReferencedFunction: 0xFFB450
            4: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameMusicDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'filenameMusicNight', Utils.getFileNameReader(),
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                    'guid', Utils.getQWordReader(),
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameMusicDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameMusicDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameMusicNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'filenameMusicNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 3, ReferencedFunction: 0xFFB340
            3: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSourceDay', Utils.getFileNameReader(),
                    'filenameAmbientDay', Utils.getFileNameReader(),
                    'filenameMusicDay', Utils.getFileNameReader(),
                    'filenameSourceNight', Utils.getFileNameReader(),
                    'filenameAmbientNight', Utils.getFileNameReader(),
                    'filenameMusicNight', Utils.getFileNameReader(),
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                ];

                this.__root = this.MapAudio = [
                    'filenameAmbientDaySurface', Utils.getFileNameReader(),
                    'filenameMusicDaySurface', Utils.getFileNameReader(),
                    'filenameAmbientDayUnderwater', Utils.getFileNameReader(),
                    'filenameMusicDayUnderwater', Utils.getFileNameReader(),
                    'filenameAmbientNightSurface', Utils.getFileNameReader(),
                    'filenameMusicNightSurface', Utils.getFileNameReader(),
                    'filenameAmbientNightUnderwater', Utils.getFileNameReader(),
                    'filenameMusicNightUnderwater', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 2
            2: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSource', Utils.getFileNameReader(),
                    'filenameAmbient', Utils.getFileNameReader(),
                    'filenameMusic', Utils.getFileNameReader(),
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                ];

                this.__root = this.MapAudio = [
                    'globalAmbientScriptFilename', Utils.getFileNameReader(),
                    'globalMusicScriptFilename', Utils.getFileNameReader(),
                    'globalAmbientUnderwaterScriptFilename', Utils.getFileNameReader(),
                    'globalMusicUnderwaterScriptFilename', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 1
            1: function() {
                this.PackMapAudioRegion = [
                    'regionType', 'uint32',
                    'overrideMode', 'uint32',
                    'filenameSource', Utils.getFileNameReader(),
                    'filenameAmbient', Utils.getFileNameReader(),
                    'filenameMusic', Utils.getFileNameReader(),
                    'points', Utils.getArrayReader(['[]', 'float32', 3]),
                    'position', ['[]', 'float32', 3],
                    'orientation', ['[]', 'float32', 3],
                    'fadeBand', 'float32',
                    'height', 'float32',
                    'radius', 'float32',
                ];

                this.__root = this.MapAudio = [
                    'globalAmbientScriptFilename', Utils.getFileNameReader(),
                    'globalMusicScriptFilename', Utils.getFileNameReader(),
                    'audioRegions', Utils.getArrayReader(this.PackMapAudioRegion),
                ];

            },

            // => Version: 0
            0: function() {
                this.__root = this.MapAudio = [
                    'globalAmbientScriptFilename', Utils.getFileNameReader(),
                    'globalMusicScriptFilename', Utils.getFileNameReader(),
                ];

            },
        }
    }


]