// luma.gl, MIT license
import StatsManager, {lumaStats} from '../utils/stats-manager';
import type {default as CanvasContext, CanvasContextProps} from './canvas-context';
import type {default as Buffer, BufferProps} from './resources/buffer';
import type {default as RenderPipeline, RenderPipelineProps} from './resources/render-pipeline';
import type {default as Sampler, SamplerProps} from './resources/sampler';
import type {default as Shader, ShaderProps} from './resources/shader';
import type {default as Texture, TextureProps} from './resources/texture';
import type {default as Framebuffer, FramebufferProps} from './resources/framebuffer';

/** Device properties */
export type DeviceProps = {
  type?: 'webgl' | 'webgpu' | 'best-available';

  // Common parameters
  canvas?: HTMLCanvasElement | OffscreenCanvas | string; // A canvas element or a canvas string id
  width?: number /** width is only used when creating a new canvas */;
  height?: number /** height is only used when creating a new canvas */;
  onContextLost?: (event: Event) => void;
  onContextRestored?: (event: Event) => void;

  // WebGLDevice parameters
  webgl2?: boolean; // Set to false to not create a WebGL2 context (force webgl1)
  webgl1?: boolean; // set to false to not create a WebGL1 context (fails if webgl2 not available)

  // WebGLContext PARAMETERS - Can only be set on context creation...
  alpha?: boolean; // Default render target has an alpha buffer.
  depth?: boolean; // Default render target has a depth buffer of at least 16 bits.
  stencil?: boolean; // Default render target has a stencil buffer of at least 8 bits.
  antialias?: boolean; // Boolean that indicates whether or not to perform anti-aliasing.
  premultipliedAlpha?: boolean; // Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha.
  preserveDrawingBuffer?: boolean; // Default render target buffers will not be automatically cleared and will preserve their values until cleared or overwritten
  failIfMajorPerformanceCaveat?: boolean; // Do not create if the system performance is low.

  // Unclear if these are still supported
  debug?: boolean; // Instrument context (at the expense of performance)
  manageState?: boolean; // Set to false to disable WebGL state management instrumentation
  break?: Array<any>; // TODO: types

  // Attach to existing context
  gl?: WebGLRenderingContext | WebGL2RenderingContext;
};

const DEFAULT_DEVICE_PROPS: Required<DeviceProps> = {
  type: 'best-available',
  canvas: undefined, // A canvas element or a canvas string id
  gl: undefined,
  webgl2: true, // Attempt to create a WebGL2 context
  webgl1: true, // Attempt to create a WebGL1 context (false to fail if webgl2 not available)
  manageState: true,
  width: 800, // width are height are only used by headless gl
  height: 600,
  debug: false, // Instrument context (at the expense of performance)
  break: undefined,
  onContextLost: () => console.error('WebGL context lost'),
  onContextRestored: () => console.info('WebGL context restored'),

  alpha: undefined,
  depth: undefined,
  stencil: undefined,
  antialias: undefined,
  premultipliedAlpha: undefined,
  preserveDrawingBuffer: undefined,
  failIfMajorPerformanceCaveat: undefined
};

export type ShadingLanguage = 'glsl' | 'wgsl';

/**
 * Identifies the GPU vendor and driver.
 * @see https://www.khronos.org/registry/webgl/extensions/WEBGL_debug_renderer_info/
 * @note Current WebGPU support is very limited
 */
export type DeviceInfo = {
  type: 'webgl' | 'webgl2' | 'webgpu';
  vendor: string;
  renderer: string;
  version: string;
  gpuVendor: 'NVIDIA' | 'AMD' | 'INTEL' | 'APPLE' | 'UNKNOWN';
  shadingLanguages: ShadingLanguage[];
  shadingLanguageVersions: Record<string, string>;
  vendorMasked?: string;
  rendererMasked?: string;
};

/** Limits for a device */
export type DeviceLimits = {
  readonly maxTextureDimension1D?: number;
  readonly maxTextureDimension2D?: number;
  readonly maxTextureDimension3D?: number;
  readonly maxTextureArrayLayers?: number;
  readonly maxBindGroups: number;
  readonly maxDynamicUniformBuffersPerPipelineLayout: number;
  readonly maxDynamicStorageBuffersPerPipelineLayout: number;
  readonly maxSampledTexturesPerShaderStage: number;
  readonly maxSamplersPerShaderStage: number;
  readonly maxStorageBuffersPerShaderStage: number;
  readonly maxStorageTexturesPerShaderStage: number;
  readonly maxUniformBuffersPerShaderStage: number;
  readonly maxUniformBufferBindingSize: number;
  readonly maxStorageBufferBindingSize?: number;
  readonly minUniformBufferOffsetAlignment?: number;
  readonly minStorageBufferOffsetAlignment?: number;
  readonly maxVertexBuffers?: number;
  readonly maxVertexAttributes?: number;
  readonly maxVertexBufferArrayStride?: number;
  readonly maxInterStageShaderComponents?: number;
  readonly maxComputeWorkgroupStorageSize?: number;
  readonly maxComputeInvocationsPerWorkgroup?: number;
  readonly maxComputeWorkgroupSizeX?: number;
  readonly maxComputeWorkgroupSizeY?: number;
  readonly maxComputeWorkgroupSizeZ?: number;
  readonly maxComputeWorkgroupsPerDimension?: number;
};

export type WebGPUDeviceFeature =
  'depth-clip-control' |
  'depth24unorm-stencil8' |
  'depth32float-stencil8' |
  'timestamp-query' |
  'indirect-first-instance' |

  'texture-compression-bc' |
  'texture-compression-etc2' |
  'texture-compression-astc'

  // obsolete...
  // 'depth-clamping' |
  // 'depth24unorm-stencil8' |
  // 'depth32float-stencil8' |
  // 'pipeline-statistics-query' |
  // 'timestamp-query' |
  // 'texture-compression-bc'
  ;

export type WebGLDeviceFeature =
  'webgl2' |

  // api support (unify with WebGPU timestamp-query?)
  'webgl-timer-query' |

  // api support
  'webgl-vertex-array-object' |
  'webgl-instanced-rendering' |
  'webgl-multiple-render-targets' |

  // features
  'webgl-element-index-uint32' |

  // blending
  'webgl-blend-equation-minmax' |
  'webgl-float-blend' |

  // textures | renderbuffers
  'webgl-color-encoding-srgb' |

  // textures
  'webgl-texture-depth' |
  'webgl-texture-float' |
  'webgl-texture-half-float' |

  'webgl-texture-filter-linear-float' |
  'webgl-texture-filter-linear-half-float' |
  'webgl-texture-filter-anisotropic' |

  // framebuffers | textures and renderbuffers
  'webgl-color-attachment-rgba32f' |
  'webgl-color-attachment-float' |
  'webgl-color-attachment-half-float' |

  // glsl extensions
  'glsl-frag-data' |
  'glsl-frag-depth' |
  'glsl-derivatives' |
  'glsl-texture-lod'
  ;

type WebGLCompressedTextureFeatures =
  'webgl-texture-compression-etc1' |
  'webgl-texture-compression-pvrtc' |
  'webgl-texture-compression-atc'
  ;

/** Valid feature strings */
export type DeviceFeature= WebGPUDeviceFeature | WebGLDeviceFeature | WebGLCompressedTextureFeatures;

/**
 * WebGPU Device/WebGL context abstraction
 */
export default abstract class Device {
  get [Symbol.toStringTag](): string {
    return 'Device';
  }

  readonly statsManager: StatsManager = lumaStats;

  canvas: HTMLCanvasElement;
  offscreenCanvas: OffscreenCanvas | undefined;

  /** Information about the device (vendor, versions etc) */
  abstract info: DeviceInfo;

  /** Optional capability discovery */
  abstract features: Set<string>;

  /** True context is already lost */
  abstract get isLost(): boolean;

  /** Promise that resolves when context is lost */
  abstract readonly lost: Promise<{reason: 'destroyed', message: string}>;

  /** Hack: Portably return drawing buffer size, used by AnimationLoop */
  getSize(): [number, number] {
    return [0, 0];
  }

  /** Resize */
  abstract resize(options: any): void;

  /** Call after rendering a frame (necessary e.g. on WebGL OffScreenCanvas) */
  abstract commit(): void;

  /** */
  abstract createCanvasContext(props?: CanvasContextProps): CanvasContext;

  // Resource creation

  /** Create a buffer */
  createBuffer(props: BufferProps): Buffer;
  createBuffer(data: ArrayBuffer | ArrayBufferView): Buffer;

  createBuffer(props: BufferProps | ArrayBuffer | ArrayBufferView): Buffer {
    return props instanceof ArrayBuffer || ArrayBuffer.isView(props)
      ? this._createBuffer({data: props})
      : this._createBuffer(props);
  }

  /** Create a render pipeline (aka program) */
  abstract createRenderPipeline(props: RenderPipelineProps): RenderPipeline;

  /** Create a sampler */
  abstract createSampler(props: SamplerProps): Sampler;

  /** Create a shader */
  abstract createShader(props: ShaderProps): Shader;

  /** Create a texture */
  abstract createTexture(props: TextureProps): Texture;

  createFramebuffer(props: FramebufferProps): Framebuffer {
    throw new Error('Not implemented');
  }

  // Implementation

  protected abstract _createBuffer(props: BufferProps): Buffer;
}