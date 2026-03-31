import { useEffect, useRef } from "react";

// Stripe-style WebGL animated gradient — adapted for React
// Brand colors: Green #1CFA76, Blue #6359EA, Orange #FFB347

function normalizeColor(hexCode: number): number[] {
  return [((hexCode >> 16) & 255) / 255, ((hexCode >> 8) & 255) / 255, (255 & hexCode) / 255];
}

class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: any[];
  commonUniforms: any;
  Material: any;
  Uniform: any;
  PlaneGeometry: any;
  Mesh: any;
  Attribute: any;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement, width: number | null, height: number | null) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl", { antialias: true })!;
    this.meshes = [];
    this.width = 0;
    this.height = 0;
    const context = this.gl;
    if (width && height) this.setSize(width, height);

    const _miniGl = this;

    this.Uniform = class {
      type: string;
      value: any;
      typeFn: string;
      transpose: boolean;
      excludeFrom: string | undefined;

      constructor(e: any) {
        this.type = "float";
        this.transpose = false;
        this.excludeFrom = undefined;
        Object.assign(this, e);
        this.typeFn = ({
          float: "1f", int: "1i", vec2: "2fv", vec3: "3fv", vec4: "4fv", mat4: "Matrix4fv"
        } as any)[this.type] || "1f";
      }

      update(location: WebGLUniformLocation) {
        if (this.value !== undefined) {
          (context as any)[`uniform${this.typeFn}`](
            location,
            this.typeFn.indexOf("Matrix") === 0 ? this.transpose : this.value,
            this.typeFn.indexOf("Matrix") === 0 ? this.value : null
          );
        }
      }

      getDeclaration(name: string, type: string, length?: number): string {
        if (this.excludeFrom === type) return "";
        if (this.type === "array") {
          return this.value[0].getDeclaration(name, type, this.value.length) + `\nconst int ${name}_length = ${this.value.length};`;
        }
        if (this.type === "struct") {
          let n = name.replace("u_", "");
          n = n.charAt(0).toUpperCase() + n.slice(1);
          return `uniform struct ${n} \n{\n` +
            Object.entries(this.value).map(([k, v]: [string, any]) => v.getDeclaration(k, type).replace(/^uniform/, "")).join("") +
            `\n} ${name}${length && length > 0 ? `[${length}]` : ""};`;
        }
        return `uniform ${this.type} ${name}${length && length > 0 ? `[${length}]` : ""};`;
      }
    };

    this.Material = class {
      uniforms: any;
      uniformInstances: any[];
      program: WebGLProgram;

      constructor(vertexShaders: string, fragments: string, uniforms: any = {}) {
        this.uniforms = uniforms;
        this.uniformInstances = [];

        function getShader(shaderType: number, source: string) {
          const shader = context.createShader(shaderType)!;
          context.shaderSource(shader, source);
          context.compileShader(shader);
          if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            console.error(context.getShaderInfoLog(shader));
          }
          return shader;
        }

        function getDecls(u: any, t: string) {
          return Object.entries(u).map(([k, v]: [string, any]) => v.getDeclaration(k, t)).join("\n");
        }

        const prefix = "\nprecision highp float;\n";
        const vs = `${prefix}\nattribute vec4 position;\nattribute vec2 uv;\nattribute vec2 uvNorm;\n${getDecls(_miniGl.commonUniforms, "vertex")}\n${getDecls(uniforms, "vertex")}\n${vertexShaders}`;
        const fs = `${prefix}\n${getDecls(_miniGl.commonUniforms, "fragment")}\n${getDecls(uniforms, "fragment")}\n${fragments}`;

        const vertexShader = getShader(context.VERTEX_SHADER, vs);
        const fragmentShader = getShader(context.FRAGMENT_SHADER, fs);
        this.program = context.createProgram()!;
        context.attachShader(this.program, vertexShader);
        context.attachShader(this.program, fragmentShader);
        context.linkProgram(this.program);
        if (!context.getProgramParameter(this.program, context.LINK_STATUS)) {
          console.error(context.getProgramInfoLog(this.program));
        }
        context.useProgram(this.program);
        this.attachUniforms(undefined, _miniGl.commonUniforms);
        this.attachUniforms(undefined, this.uniforms);
      }

      attachUniforms(name: string | undefined, uniforms: any) {
        if (name === undefined) {
          Object.entries(uniforms).forEach(([k, v]) => this.attachUniforms(k, v));
        } else if (uniforms.type === "array") {
          uniforms.value.forEach((u: any, i: number) => this.attachUniforms(`${name}[${i}]`, u));
        } else if (uniforms.type === "struct") {
          Object.entries(uniforms.value).forEach(([k, v]) => this.attachUniforms(`${name}.${k}`, v));
        } else {
          this.uniformInstances.push({
            uniform: uniforms,
            location: context.getUniformLocation(this.program, name)
          });
        }
      }
    };

    this.Attribute = class {
      target: number;
      size: number;
      type: number;
      normalized: boolean;
      buffer: WebGLBuffer;
      values: any;

      constructor(e: any) {
        this.type = context.FLOAT;
        this.normalized = false;
        this.buffer = context.createBuffer()!;
        this.target = e.target;
        this.size = e.size;
        if (e.type) this.type = e.type;
        Object.assign(this, e);
        this.update();
      }

      update() {
        if (this.values !== undefined) {
          context.bindBuffer(this.target, this.buffer);
          context.bufferData(this.target, this.values, context.STATIC_DRAW);
        }
      }

      attach(name: string, program: WebGLProgram) {
        const loc = context.getAttribLocation(program, name);
        if (this.target === context.ARRAY_BUFFER) {
          context.enableVertexAttribArray(loc);
          context.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0);
        }
        return loc;
      }

      use(loc: number) {
        context.bindBuffer(this.target, this.buffer);
        if (this.target === context.ARRAY_BUFFER) {
          context.enableVertexAttribArray(loc);
          context.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0);
        }
      }
    };

    this.PlaneGeometry = class {
      attributes: any;
      xSegCount: number;
      ySegCount: number;
      vertexCount: number;
      quadCount: number;
      width: number;
      height: number;

      constructor() {
        context.createBuffer();
        this.xSegCount = 0;
        this.ySegCount = 0;
        this.vertexCount = 0;
        this.quadCount = 0;
        this.width = 0;
        this.height = 0;
        this.attributes = {
          position: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 3 }),
          uv: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          uvNorm: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          index: new _miniGl.Attribute({ target: context.ELEMENT_ARRAY_BUFFER, size: 3, type: context.UNSIGNED_SHORT }),
        };
      }

      setTopology(xSeg: number = 1, ySeg: number = 1) {
        this.xSegCount = xSeg;
        this.ySegCount = ySeg;
        this.vertexCount = (xSeg + 1) * (ySeg + 1);
        this.quadCount = xSeg * ySeg * 2;
        this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
        this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
        this.attributes.index.values = new Uint16Array(3 * this.quadCount);
        for (let y = 0; y <= ySeg; y++) {
          for (let x = 0; x <= xSeg; x++) {
            const i = y * (xSeg + 1) + x;
            this.attributes.uv.values[2 * i] = x / xSeg;
            this.attributes.uv.values[2 * i + 1] = 1 - y / ySeg;
            this.attributes.uvNorm.values[2 * i] = (x / xSeg) * 2 - 1;
            this.attributes.uvNorm.values[2 * i + 1] = 1 - (y / ySeg) * 2;
            if (x < xSeg && y < ySeg) {
              const s = y * xSeg + x;
              this.attributes.index.values[6 * s] = i;
              this.attributes.index.values[6 * s + 1] = i + 1 + xSeg;
              this.attributes.index.values[6 * s + 2] = i + 1;
              this.attributes.index.values[6 * s + 3] = i + 1;
              this.attributes.index.values[6 * s + 4] = i + 1 + xSeg;
              this.attributes.index.values[6 * s + 5] = i + 2 + xSeg;
            }
          }
        }
        this.attributes.uv.update();
        this.attributes.uvNorm.update();
        this.attributes.index.update();
      }

      setSize(w: number = 1, h: number = 1, orientation: string = "xz") {
        this.width = w;
        this.height = h;
        if (!this.attributes.position.values || this.attributes.position.values.length !== 3 * this.vertexCount) {
          this.attributes.position.values = new Float32Array(3 * this.vertexCount);
        }
        const ox = w / -2, oy = h / -2;
        const sw = w / this.xSegCount, sh = h / this.ySegCount;
        for (let yi = 0; yi <= this.ySegCount; yi++) {
          const ty = oy + yi * sh;
          for (let xi = 0; xi <= this.xSegCount; xi++) {
            const tx = ox + xi * sw;
            const idx = yi * (this.xSegCount + 1) + xi;
            this.attributes.position.values[3 * idx + "xyz".indexOf(orientation[0])] = tx;
            this.attributes.position.values[3 * idx + "xyz".indexOf(orientation[1])] = -ty;
          }
        }
        this.attributes.position.update();
      }
    };

    this.Mesh = class {
      geometry: any;
      material: any;
      wireframe: boolean;
      attributeInstances: any[];

      constructor(geometry: any, material: any) {
        this.geometry = geometry;
        this.material = material;
        this.wireframe = false;
        this.attributeInstances = [];
        Object.entries(geometry.attributes).forEach(([name, attr]: [string, any]) => {
          this.attributeInstances.push({
            attribute: attr,
            location: attr.attach(name, material.program),
          });
        });
        _miniGl.meshes.push(this);
      }

      draw() {
        context.useProgram(this.material.program);
        this.material.uniformInstances.forEach(({ uniform, location }: any) => uniform.update(location));
        this.attributeInstances.forEach(({ attribute, location }: any) => attribute.use(location));
        context.drawElements(
          this.wireframe ? context.LINES : context.TRIANGLES,
          this.geometry.attributes.index.values.length,
          context.UNSIGNED_SHORT,
          0
        );
      }
    };

    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new this.Uniform({ type: "mat4", value: identity }),
      modelViewMatrix: new this.Uniform({ type: "mat4", value: identity }),
      resolution: new this.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new this.Uniform({ type: "float", value: 1 }),
    };
  }

  setSize(w: number = 640, h: number = 480) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.commonUniforms.resolution.value = [w, h];
    this.commonUniforms.aspectRatio.value = w / h;
  }

  setOrthographicCamera() {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width, 0, 0, 0,
      0, 2 / this.height, 0, 0,
      0, 0, 2 / (-2000 - 2000), 0,
      0, 0, 0, 1,
    ];
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m) => m.draw());
  }
}

// Shader sources
const noiseShader = `vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

const blendShader = `vec3 blendNormal(vec3 base,vec3 blend){return blend;}vec3 blendNormal(vec3 base,vec3 blend,float opacity){return(blendNormal(base,blend)*opacity+base*(1.0-opacity));}`;

const vertexShader = `varying vec3 v_color;
void main(){
  float time=u_time*u_global.noiseSpeed;
  vec2 noiseCoord=resolution*uvNorm*u_global.noiseFreq;
  vec2 st=1.-uvNorm.xy;
  float tilt=resolution.y/2.0*uvNorm.y;
  float incline=resolution.x*uvNorm.x/2.0*u_vertDeform.incline;
  float offset=resolution.x/2.0*u_vertDeform.incline*mix(u_vertDeform.offsetBottom,u_vertDeform.offsetTop,uv.y);
  float noise=snoise(vec3(noiseCoord.x*u_vertDeform.noiseFreq.x+time*u_vertDeform.noiseFlow,noiseCoord.y*u_vertDeform.noiseFreq.y,time*u_vertDeform.noiseSpeed+u_vertDeform.noiseSeed))*u_vertDeform.noiseAmp;
  noise*=1.0-pow(abs(uvNorm.y),2.0);
  noise=max(0.0,noise);
  vec3 pos=vec3(position.x,position.y+tilt+incline+noise-offset,position.z);
  if(u_active_colors[0]==1.){v_color=u_baseColor;}
  for(int i=0;i<u_waveLayers_length;i++){
    if(u_active_colors[i+1]==1.){
      WaveLayers layer=u_waveLayers[i];
      float n=smoothstep(layer.noiseFloor,layer.noiseCeil,snoise(vec3(noiseCoord.x*layer.noiseFreq.x+time*layer.noiseFlow,noiseCoord.y*layer.noiseFreq.y,time*layer.noiseSpeed+layer.noiseSeed))/2.0+0.5);
      v_color=blendNormal(v_color,layer.color,pow(n,4.));
    }
  }
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}`;

const fragmentShader = `varying vec3 v_color;
void main(){
  vec3 color=v_color;
  if(u_darken_top==1.0){
    vec2 st=gl_FragCoord.xy/resolution.xy;
    color.g-=pow(st.y+sin(-12.0)*st.x,u_shadow_power)*0.4;
  }
  gl_FragColor=vec4(color,1.0);
}`;

const GradientCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sectionColors = [
      normalizeColor(0x1CFA76), // Green
      normalizeColor(0x6359EA), // Blue
      normalizeColor(0xFFB347), // Orange
      normalizeColor(0x1CFA76), // Green again for wrap
    ];

    const minigl = new MiniGl(canvas, null, null);
    const width = window.innerWidth;
    const height = 600;
    minigl.setSize(width, height);
    minigl.setOrthographicCamera();

    const amp = 320, seed = 5, freqX = 14e-5, freqY = 29e-5, angle = 0;

    const uniforms: any = {
      u_time: new minigl.Uniform({ value: 0 }),
      u_shadow_power: new minigl.Uniform({ value: width < 600 ? 5 : 6 }),
      u_darken_top: new minigl.Uniform({ value: 1 }),
      u_active_colors: new minigl.Uniform({ value: [1, 1, 1, 1], type: "vec4" }),
      u_global: new minigl.Uniform({
        value: {
          noiseFreq: new minigl.Uniform({ value: [freqX, freqY], type: "vec2" }),
          noiseSpeed: new minigl.Uniform({ value: 5e-6 }),
        },
        type: "struct",
      }),
      u_vertDeform: new minigl.Uniform({
        value: {
          incline: new minigl.Uniform({ value: Math.sin(angle) / Math.cos(angle) }),
          offsetTop: new minigl.Uniform({ value: -0.5 }),
          offsetBottom: new minigl.Uniform({ value: -0.5 }),
          noiseFreq: new minigl.Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp: new minigl.Uniform({ value: amp }),
          noiseSpeed: new minigl.Uniform({ value: 10 }),
          noiseFlow: new minigl.Uniform({ value: 3 }),
          noiseSeed: new minigl.Uniform({ value: seed }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new minigl.Uniform({ value: sectionColors[0], type: "vec3", excludeFrom: "fragment" }),
      u_waveLayers: new minigl.Uniform({ value: [] as any[], excludeFrom: "fragment", type: "array" }),
    };

    for (let i = 1; i < sectionColors.length; i++) {
      uniforms.u_waveLayers.value.push(
        new minigl.Uniform({
          value: {
            color: new minigl.Uniform({ value: sectionColors[i], type: "vec3" }),
            noiseFreq: new minigl.Uniform({ value: [2 + i / sectionColors.length, 3 + i / sectionColors.length], type: "vec2" }),
            noiseSpeed: new minigl.Uniform({ value: 11 + 0.3 * i }),
            noiseFlow: new minigl.Uniform({ value: 6.5 + 0.3 * i }),
            noiseSeed: new minigl.Uniform({ value: seed + 10 * i }),
            noiseFloor: new minigl.Uniform({ value: 0.1 }),
            noiseCeil: new minigl.Uniform({ value: 0.63 + 0.07 * i }),
          },
          type: "struct",
        })
      );
    }

    const fullVertex = [noiseShader, blendShader, vertexShader].join("\n\n");
    const material = new minigl.Material(fullVertex, fragmentShader, uniforms);
    const geometry = new minigl.PlaneGeometry();
    const mesh = new minigl.Mesh(geometry, material);

    const density = [0.06, 0.16];
    const xSeg = Math.ceil(width * density[0]);
    const ySeg = Math.ceil(height * density[1]);
    mesh.geometry.setTopology(xSeg, ySeg);
    mesh.geometry.setSize(width, height);

    let t = 1253106;
    let last = 0;

    const animate = (now: number) => {
      if (document.hidden) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      t += Math.min(now - last, 1000 / 15);
      last = now;
      uniforms.u_time.value = t;
      minigl.render();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      minigl.setSize(w, height);
      minigl.setOrthographicCamera();
      mesh.geometry.setTopology(Math.ceil(w * density[0]), Math.ceil(height * density[1]));
      mesh.geometry.setSize(w, height);
      uniforms.u_shadow_power.value = w < 600 ? 5 : 6;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
};

export default GradientCanvas;
