/**
* @author Mat Groves http://matgroves.com/ @Doormat23
*/

/**
* This turns your displayObjects to grayscale.
* @class Gray
* @contructor
*/
Phaser.Filter.Chromatical = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.gray = { type: '1f', value: 1.0 };

    this.fragmentSrc = [

        "precision mediump float;",
        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform sampler2D  uSampler;",
        "uniform float      gray;",

        "void main(void) {",

//            "vec2 uv = vTextureCoord.xy / resolution.xy;",
            "vec2 uv = vTextureCoord.xy;",
            "float d = length(uv - vec2(0.5,0.5));",
        
            "float blur = 0.0;",
            "blur = (1.0 + sin(time*1.0)) * 0.5;",
            "blur *= 1.0 + sin(time*5.0) * 0.5;",
            "blur = pow(blur, 2.0);",
            "blur *= 0.01;",
            "// reduce blur towards center",
            "blur *= d;",
            
            "// final color",
            "vec3 col;",
            "col.r = texture2D( uSampler, vec2(uv.x+blur,uv.y) ).r;",
            "col.g = texture2D( uSampler, uv ).g;",
            "col.b = texture2D( uSampler, vec2(uv.x-blur,uv.y) ).b;",
            
            "// scanline",
            "float scanline = sin(uv.y*900.0+time)*0.04;",
            "col -= scanline;",
            
            "// vignette",
            "col *= 1.0 - d * 1.0;",
        
            "gl_FragColor = vec4(col,1.0);",
        "}"

    ];

};

Phaser.Filter.Chromatical.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Chromatical.prototype.constructor = Phaser.Filter.Chromatical;

/**
* The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color
* @property gray
*/
Object.defineProperty(Phaser.Filter.Chromatical.prototype, 'gray', {

    get: function() {
        return this.uniforms.gray.value;
    },

    set: function(value) {
        this.uniforms.gray.value = value;
    }

});


Phaser.Filter.Chromatical.prototype.init = function (width, height) {
   this.setResolution(width, height);
};