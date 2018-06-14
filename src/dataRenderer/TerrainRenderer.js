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

const RenderUtils = require("../util/RenderUtils");
const MaterialUtils = require("../util/MaterialUtils");
const DataRenderer = require('./DataRenderer');
const GW2File = require("../format/file/GW2File.js");

const TerrainShader = require("../util/TerrainShader.js");

/**
 *
 * A renderer that generates the meshes for the terrain of a map.
 *
 * 
 * Requires a context previously populated by a 
 * {{#crossLink "EnvironmentRenderer"}}{{/crossLink}}.
 * 
 * @class TerrainRenderer
 * @constructor
 * @extends DataRenderer
 * @param  {LocalReader} localReader  The LocalReader instance to read data from.
 * @param  {Object} settings     Any settings used by this renderer.
 * *Must* specify "mapFile", a GW2File.
 * @param  {Object} context      Shared value object between renderers.
 * @param  {Logger} logger       The logging class to use for progress, warnings, errors et cetera.
 */
class TerrainRenderer extends DataRenderer {
	constructor(localReader, settings, context, logger) {
		super(localReader, settings, context, logger);

		this.mapFile = this.settings.mapFile;

		this.drawWater = function (rect) {

			/// Add Water
			var material = material || new THREE.MeshBasicMaterial({
				color: 0x5bb1e8,
				wireframe: false,
				opacity: 0.35
			});

			material.transparent = true;
			return RenderUtils.renderRect(rect, 0, material);
		}

		this.parseNumChunks = function (terrainData) {
			terrainData.numChunksD_1 = Math.sqrt(
				terrainData.dims[0] *
				terrainData.chunkArray.length /
				terrainData.dims[1]
			);
			terrainData.numChunksD_2 =
				terrainData.chunkArray.length / terrainData.numChunksD_1;
		}

		this.loadPagedImageCallback = function (callback, inflatedBuffer) {
			var self = this;

			// Prep output array
			self.getOutput().terrainTiles = [];

			var pimgDS = new DataStream(inflatedBuffer);
			var pimgFile = new GW2File(pimgDS, 0);
			var pimgTableDataChunk = pimgFile.getChunk("pgtb");
			var pimgData = pimgTableDataChunk && pimgTableDataChunk.data;

			this.mapRect = null;

			/// Fetch chunks
			var terrainData = this.mapFile.getChunk("trn").data;
			var parameterData = this.mapFile.getChunk("parm").data;

			/// Read settings
			var maxAnisotropy = this.settings.anisotropy ? this.settings.anisotropy : 1;

			var chunks = [];
			var chunkW = 35;

			/// Calculate numChunksD_1 and _2
			this.parseNumChunks(terrainData);

			var xChunks = terrainData.numChunksD_1;
			var yChunks = terrainData.numChunksD_2;

			var allMaterials = terrainData.materials.materials;
			var allTextures = terrainData.materials.texFileArray;

			//Total map dx and dy
			var dx = parameterData.rect[2] - parameterData.rect[0];
			var dy = parameterData.rect[3] - parameterData.rect[1];

			//Each chunk dx and dy
			var cdx = dx / terrainData.numChunksD_1 * 1; //  35/33;
			var cdy = dy / terrainData.numChunksD_2 * 1; //35/33;
			var n = 0;
			var allMats = [];
			var customMaterial = new THREE.MeshLambertMaterial({
				side: THREE.DoubleSide,
				color: 0x666666,
				flatShading: true
			});
			var texMats = {};

			/// Load textures from PIMG and inject as material maps (textures)
			var chunkTextures = {};

			/// Load textures
			if (pimgData) {
				var strippedPages = pimgData.strippedPages;

				///Only use layer 0
				strippedPages.forEach(function (page) {

					/// Only load layer 0 and 1
					if (page.layer <= 1) {
						var filename = page.filename;
						var color = page.solidColor;
						var coord = page.coord;

						var matName = coord[0] + "," + coord[1];
						if (page.layer == 1)
							matName += "-2";


						/// Add texture to list, note that coord name is used, not actual file name
						if (!chunkTextures[matName]) {

							/// Load local texture, here we use file name!
							var chunkTex = MaterialUtils.loadLocalTexture(self.localReader, filename);

							if (chunkTex) {
								/// Set repeat, antistropy and repeat Y
								chunkTex.anisotropy = maxAnisotropy;
								chunkTex.wrapS = THREE.RepeatWrapping;
								chunkTex.wrapT = THREE.RepeatWrapping;
							}

							///...But store in coord name
							chunkTextures[matName] = chunkTex;

						}
					}

				}); /// end for each stripped page in pimgData
			}



			/// Render Each chunk
			/// We'll make this async in order for the screen to be able to update

			var renderChunk = function (cx, cy) {
				var chunkIndex = cy * xChunks + cx;

				var pageX = Math.floor(cx / 4);
				var pageY = Math.floor(cy / 4);

				//TODO: Terrain texture LOD ?
				var chunkTextureIndices = allMaterials[chunkIndex].loResMaterial.texIndexArray;
				var matFileName = allMaterials[chunkIndex].loResMaterial.materialFile;
				//var chunkTextureIndices = allMaterials[chunkIndex].hiResMaterial.texIndexArray;
				//var matFileName = allMaterials[chunkIndex].hiResMaterial.materialFile;


				var chunkData = terrainData.chunkArray[chunkIndex];

				var mainTex = allTextures[chunkTextureIndices[0]];
				var mat = customMaterial;

				/// TODO: just tick invert y = false...?
				var pageOffetX = (cx % 4) / 4.0;
				var pageOffetY = 0.75 - (cy % 4) / 4.0;

				//offset 0 -> 0.75


				//Make sure we have shared textures

				/// Load and store all tiled textures
				var fileNames = [];
				for (var gi = 0; gi < chunkTextureIndices.length / 2; gi++) {
					var textureFileName = allTextures[chunkTextureIndices[gi]].filename;

					fileNames.push(textureFileName);

					/// If the texture is not already loaded, read it from the .dat!
					if (!chunkTextures[textureFileName]) {

						/// Load local texture
						var chunkTex = MaterialUtils.loadLocalTexture(self.localReader, textureFileName);

						if (chunkTex) {
							/// Set repeat, antistropy and repeat Y
							chunkTex.anisotropy = maxAnisotropy;
							chunkTex.wrapS = THREE.RepeatWrapping;
							chunkTex.wrapT = THREE.RepeatWrapping;
						}

						chunkTextures[textureFileName] = chunkTex;
					}
				} /// End for each chunkTextureIndices

				/// Create Composite texture material, refering the shared textures
				var pageTexName = pageX + "," + pageY;
				var pageTexName2 = pageX + "," + pageY + "-2";


				//var fog = SceneUtils.getScene().fog;
				var fog = {
					color: {
						r: 1,
						g: 1,
						b: 1
					},
					near: 0,
					far: 0
				}

				/// Get haze color from environment rednerer
				var envOutput = self.getOutput(T3D.EnvironmentRenderer);
				if (envOutput.hazeColor) {
					fog.color.r = envOutput.hazeColor[2] / 255.0;
					fog.color.g = envOutput.hazeColor[1] / 255.0;
					fog.color.b = envOutput.hazeColor[0] / 255.0;
				}

				var uniforms = THREE.UniformsUtils.merge([
					THREE.UniformsLib['lights'],
				]);

				/// TODO: READ FROM VO, don't default to hard coded scale
				uniforms.uvScale = {
					type: "v2",
					value: new THREE.Vector2(8.0, 8.0)
				};
				uniforms.offset = {
					type: "v2",
					value: new THREE.Vector2(pageOffetX, pageOffetY)
				};

				uniforms.texturePicker = {
					type: "t",
					value: chunkTextures[pageTexName]
				};
				uniforms.texturePicker2 = {
					type: "t",
					value: chunkTextures[pageTexName2]
				};

				uniforms.texture1 = {
					type: "t",
					value: chunkTextures[fileNames[0]]
				};
				uniforms.texture2 = {
					type: "t",
					value: chunkTextures[fileNames[1]]
				};
				uniforms.texture3 = {
					type: "t",
					value: chunkTextures[fileNames[2]]
				};
				uniforms.texture4 = {
					type: "t",
					value: chunkTextures[fileNames[3]]
				};


				mat = new THREE.ShaderMaterial({
					uniforms: uniforms,
					fragmentShader: TerrainShader.getFragmentShader(),
					vertexShader: TerrainShader.getVertexShader()
				});

				///Store referenceto each material
				allMats.push(mat);


				/// -1 for faces -> vertices , -2 for ignoring outer faces
				var chunkGeo = new THREE.PlaneBufferGeometry(cdx, cdy, chunkW - 3, chunkW - 3);

				var cn = 0;

				///Render chunk

				/// Each chunk vertex
				for (var y = 0; y < chunkW; y++) {

					for (var x = 0; x < chunkW; x++) {

						if (x != 0 && x != chunkW - 1 && y != 0 && y != chunkW - 1) {
							chunkGeo.getAttribute('position').array[cn * 3 + 2] = terrainData.heightMapArray[n];
							cn++;
						}

						n++;
					}
				} // End each chunk vertex


				/// Flip the plane to fit wonky THREE js world axes
				var mS = (new THREE.Matrix4()).identity();
				mS.elements[5] = -1;
				chunkGeo.applyMatrix(mS);

				/// Compute face normals for lighting, not used when textured
				chunkGeo.computeFaceNormals();
				//chunkGeo.computeVertexNormals();


				/// Build chunk mesh!
				var chunk;
				chunk = new THREE.Mesh(chunkGeo, customMaterial);
				if (mat.length) {
					chunk = THREE.SceneUtils.createMultiMaterialObject(chunkGeo, mat);
				} else {
					chunk = new THREE.Mesh(chunkGeo, mat);
				}


				///Move and rotate Mesh to fit in place
				chunk.rotation.set(Math.PI / 2, 0, 0);

				/// Last term is the new one: -cdx*(2/35)
				var globalOffsetX = parameterData.rect[0] + cdx / 2;
				var chunkOffsetX = cx * cdx;

				chunk.position.x = globalOffsetX + chunkOffsetX;

				///Adjust for odd / even number of chunks
				if (terrainData.numChunksD_2 % 2 == 0) {

					/// Last term is the new one: -cdx*(2/35)
					var globalOffsetY = parameterData.rect[1] + cdy / 2 - 0; // -cdy*(1/35);
					var chunkOffsetY = cy * cdy * 1; //33/35;

					chunk.position.z = chunkOffsetY + globalOffsetY;
				} else {

					var globalOffsetY = parameterData.rect[1] - cdy / 2 + 0; //cdy*(1/35);
					var chunkOffsetY = cy * cdy * 1; //33/35;

					chunk.position.z = globalOffsetY + chunkOffsetY;
				}


				var px = chunk.position.x;
				var py = chunk.position.z;


				if (!self.mapRect) {
					self.mapRect = {
						x1: px - cdx / 2,
						x2: px + cdx / 2,
						y1: py - cdy / 2,
						y2: py + cdy / 2
					};
				}

				self.mapRect.x1 = Math.min(self.mapRect.x1, px - cdx / 2);
				self.mapRect.x2 = Math.max(self.mapRect.x2, px + cdx / 2);

				self.mapRect.y1 = Math.min(self.mapRect.y1, py - cdy / 2);
				self.mapRect.y2 = Math.max(self.mapRect.y2, py + cdy / 2);

				chunk.updateMatrix();
				chunk.updateMatrixWorld();

				/// Add to list of stuff to render
				/// TODO: Perhaps use some kind of props for each entry instead?
				self.getOutput().terrainTiles.push(chunk);

			} /// End render chunk function


			var stepChunk = function (cx, cy) {
				if (cx >= xChunks) {
					cx = 0;
					cy++;
				}

				if (cy >= yChunks) {

					/// Draw water surface using map bounds				
					self.getOutput().water = self.drawWater(self.mapRect);

					/// Set bounds in output VO
					self.getOutput().bounds = self.mapRect;

					/// Fire call back, we're done rendering.
					callback();
					return;
				}

				var pct = Math.floor(100 * (cy * xChunks + cx) / (xChunks * yChunks));

				self.logger.log(T3D.Logger.TYPE_PROGRESS, "Loading Terrain", pct);

				renderChunk(cx, cy);
				setTimeout(stepChunk, 1, cx + 1, cy);
			}

			stepChunk(0, 0);
		};
	}


	/**
	 * Output fileds generated:
	 * 
	 * - *terrainTiles* An array of THREE.Mesh objects visualizing terrain of the map.
	 * 
	 * - *water* A THREE.Mesh object visualizing the bounds of the map.
	 * 
	 * - *bounds* An object wiht x1, x2, y1, and y2 properties specifying the bounds of the map.
	 * 
	 * @async
	 * @param  {Function} callback Fires when renderer is finished, does not take arguments.
	 */
	renderAsync(callback) {

		/// Load all paged Images, requires inflation of other pack files!
		var pagedImageId = this.mapFile.getChunk("trn").data.materials.pagedImage;
		this.localReader.readFile(pagedImageId, false, false, undefined, undefined, true)
			.then((result) => {
				this.loadPagedImageCallback(callback, result.buffer);
			});
	}

	/**
	 * TODO: write description. Used for export feature
	 * 
	 * @param  {Function} callback [description]
	 * @return {*}            [description]
	 */
	getFileIdsAsync(callback) {

		var terrainChunk = this.mapFile.getChunk("trn");
		var pimgTableDataChunk = this.mapFile.getChunk("pimg");
		var fileIds = [];

		/// ------------ SPLASH TEXTURES ------------
		var pimgData = pimgTableDataChunk && pimgTableDataChunk.data;
		var strippedPages = pimgData.strippedPages;

		///Only use layer 0
		strippedPages.forEach(function (page) {

			/// Only load layer 0 and 1
			if (page.layer <= 1 && page.filename > 0) {
				fileIds.push(page.filename);
			}
		});
		/// ------------ END SPLASH TEXTURES ------------



		/// ------------ TILED IMAGES ------------
		var terrainData = terrainChunk.data;
		var allTextures = terrainData.materials.texFileArray;
		allTextures.forEach(function (texture) {
			if (texture.filename > 0)
				fileIds.push(texture.filename);
		})
		/// ------------ END TILED IMAGES ------------

		return fileIds;
	}
}

module.exports = TerrainRenderer;