import type {TextureFormat, DeviceFeature} from '@luma.gl/api';
import GL from '@luma.gl/constants';

// Define local extension strings to optimize minification
const SRGB = 'EXT_sRGB';
const EXT_FLOAT_WEBGL1 = 'WEBGL.color_buffer_float';
const EXT_FLOAT_WEBGL2 = 'EXT_color_buffer_float';
const EXT_HALF_FLOAT_WEBGL1 = 'EXT_color_buffer_half_float';
const DEPTH = 'WEBGL_depth_texture';

// DXT
const X_S3TC = 'WEBGL_compressed_texture_s3tc'; // BC1, BC2, BC3
const X_S3TC_SRGB = 'WEBGL_compressed_texture_s3tc_srgb'; // BC1, BC2, BC3
const X_RGTC = 'EXT_texture_compression_rgtc'; // BC4, BC5
const X_BPTC = 'EXT_texture_compression_bptc'; // BC6, BC7

const X_ETC2 = 'WEBGL_compressed_texture_etc'; // Renamed from 'WEBGL_compressed_texture_es3'

const X_ASTC = 'WEBGL_compressed_texture_astc';

const X_ETC1 = 'WEBGL_compressed_texture_etc1';
const X_PVRTC = 'WEBGL_compressed_texture_pvrtc';
const X_ATC = 'WEBGL_compressed_texture_atc';

const TEXTURE_FEATURES: [DeviceFeature, string[]][] = [
  ['texture-compression-bc', [X_S3TC, X_S3TC_SRGB, X_BPTC]],
  ['texture-compression-etc2', [X_ETC2]],
  ['texture-compression-astc', [X_ASTC]],
  ['webgl-texture-compression-etc1', [X_ETC1]],
  ['webgl-texture-compression-pvrtc', [X_PVRTC]],
  ['webgl-texture-compression-atc', [X_ATC]]
];

/** Map a format to webgl and constants */
type Format = {
  gl?: GL;

  b?: number; // (bytes per pixel), for memory usage calculations.
  c?: number; //  (channels)
  bpp?: number;
  p?: number; // (packed)
  x?: string;  // compressed

  gl1?: string;
  gl2?: boolean | string; // format requires WebGL2, when using a WebGL 1 context, color renderbuffer formats are limited
};

export const TEXTURE_FORMAT_DEFINITIONS: Record<TextureFormat, Format> = {
  // 8-bit formats
  'r8unorm': {gl: GL.R8, b: 1, c: 1, gl2: true},
  'r8snorm': {b: 1, c: 1},
  'r8uint': {gl: GL.R8UI, b: 1, c: 1, gl2: true},
  'r8sint': {gl: GL.R8I, b: 1, c: 1, gl2: true},

  // 16-bit formats
  'r16uint': {gl: GL.R16UI, b: 2, c: 1, gl2: true},
  'r16sint': {gl: GL.R16I, b: 2, c: 1, gl2: true},
  'r16float': {gl: GL.R16F, b: 2, c: 1, gl2: EXT_FLOAT_WEBGL2},
  'rg8unorm': {gl: GL.RG8, b: 2, c: 2, gl2: true},
  'rg8snorm': {b: 2, c: 2},
  'rg8uint': {gl: GL.RG8UI, b: 2, c: 2, gl2: true},
  'rg8sint': {gl: GL.RG8I, b: 2, c: 2, gl2: true},

  // Packed 16-bit formats
  // @ts-expect-error not exposed by WebGPU)
  'webgl-rgba4norm': {gl: GL.RGBA4, b: 2, c: 4, wgpu: false},
  'webgl-rgb565norm': {gl: GL.RGB565, b: 2, c: 4, wgpu: false},
  'webgl-rgb5a1norm': {gl: GL.RGB5_A1, b: 2, c: 4, wgpu: false},

  // 24-bit formats
  'webgl-rbg8norm': {gl: GL.RGB8, b: 3, c: 3, gl2: true, wgpu: false},

  // 32-bit formats
  'r32uint': {gl: GL.R32UI, b: 4, c: 1, gl2: true, bpp: 4},
  'r32sint': {gl: GL.R32I, b: 4, c: 1, gl2: true, bpp: 4},
  'r32float': {gl: GL.R32F, b: 4, c: 1, gl2: EXT_FLOAT_WEBGL2, bpp: 4},
  'rg16uint': {gl: GL.RG16UI, b: 4, c: 1, gl2: true, bpp: 4},
  'rg16sint': {gl: GL.RG16I, b: 4, c: 2, gl2: true, bpp: 4},
  // When using a WebGL 2 context and the EXT_color_buffer_float WebGL2 extension
  'rg16float': {gl: GL.RG16F, b: 4, c: 2, gl2: EXT_FLOAT_WEBGL2, bpp: 4},
  'rgba8unorm': {gl: GL.RGBA8, b: 4, c: 2, gl2: true, bpp: 4},

  'rgba8unorm-srgb': {gl: GL.SRGB8_ALPHA8, b: 4, c: 4, gl2: true, gl1: SRGB, bpp: 4},
  'rgba8snorm': {b: 4, c: 4},
  'rgba8uint': {gl: GL.RGBA8UI, b: 4, c: 4, gl2: true, bpp: 4},
  'rgba8sint': {gl: GL.RGBA8I, b: 4, c: 4, gl2: true, bpp: 4},
  'bgra8unorm': {b: 4, c: 4},
  'bgra8unorm-srgb': {b: 4, c: 4},

  // Packed 32-bit formats
  'rgb9e5ufloat': {gl: GL.RGB9_E5, b: 4, c: 3, p: 1, gl2: true, gl1: 'WEBGL_color_buffer_half_float'},
  'rg11b10ufloat': {gl: GL.R11F_G11F_B10F, b: 4, c: 3, p: 1, gl2: EXT_FLOAT_WEBGL2},
  'rgb10a2unorm': {gl: GL.RGB10_A2, b: 4, c: 4, p: 1, gl2: true},
  // webgl2 only
  'webgl-rgb10a2unorm': {b: 4, c: 4, gl: GL.RGB10_A2UI, p: 1, webgpu: false, gl2: true, bpp: 4},

  // 64-bit formats
  'rg32uint': {gl: GL.RG32UI, b: 8, c: 2, gl2: true},
  'rg32sint': {gl: GL.RG32I, b: 8, c: 2, gl2: true},
  'rg32float': {gl: GL.RG32F, b: 8, c: 2, gl2: EXT_FLOAT_WEBGL2},
  'rgba16uint': {gl: GL.RGBA16UI, b: 8, c: 4, gl2: true},
  'rgba16sint': {gl: GL.RGBA16I, b: 8, c: 4, gl2: true},
  'rgba16float': {gl: GL.RGBA16F, b: 8, c: 4, gl2: EXT_FLOAT_WEBGL2},

  // 96-bit formats
  'webgl-rgb32float': {gl: GL.RGB32F, dataFormat: GL.RGB, types: [GL.FLOAT], gl2: true},

  // 128-bit formats
  'rgba32uint': {gl: GL.RGBA32UI, b: 16, c: 4, gl2: true},
  'rgba32sint': {gl: GL.RGBA32I, b: 16, c: 4, gl2: true},
  'rgba32float': {gl: GL.RGBA32F, b: 16, c: 4, gl2: EXT_FLOAT_WEBGL2}, // gl1: EXT_FLOAT_WEBGL1

  // Depth and stencil formats
  'stencil8': {gl: GL.STENCIL_INDEX8, b: 1, c: 1}, // 8 stencil bits
  'depth16unorm': {gl: GL.DEPTH_COMPONENT16, b: 2, c: 1}, // 16 depth bits
  'depth24plus': {gl: GL.DEPTH_COMPONENT24, b: 3, c: 1, gl2: true},
  'depth24plus-stencil8': {b: 4, gl: GL.DEPTH24_STENCIL8, c: 2, p: 1, gl2: true},
  'depth32float': {gl: GL.DEPTH_COMPONENT32F, b: 4, c: 1, gl2: true},

  // "depth24unorm-stencil8" feature
  'depth24unorm-stencil8': {gl: GL.DEPTH_STENCIL, b: 4, c: 2, p: 1},

  // "depth32float-stencil8" feature
  "depth32float-stencil8": {gl: GL.DEPTH32F_STENCIL8, b: 5, c: 2, p: 1, gl2: true},

  // BC compressed formats: check device.features.has("texture-compression-bc");

  'webgl-bc1-rgb-unorm': {gl: GL.COMPRESSED_RGB_S3TC_DXT1_EXT, x: X_S3TC},
  'webgl-bc1-rgb-unorm-srgb': {gl: GL.COMPRESSED_SRGB_S3TC_DXT1_EXT, x: X_S3TC_SRGB},

  'bc1-rgba-unorm': {gl: GL.COMPRESSED_RGBA_S3TC_DXT1_EXT, x: X_S3TC},
  'bc1-rgba-unorm-srgb': {gl: GL.COMPRESSED_SRGB_S3TC_DXT1_EXT, x: X_S3TC_SRGB},
  'bc2-rgba-unorm': {gl: GL.COMPRESSED_RGBA_S3TC_DXT3_EXT, x: X_S3TC},
  'bc2-rgba-unorm-srgb': {gl: GL.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, x: X_S3TC_SRGB},
  'bc3-rgba-unorm': {gl: GL.COMPRESSED_RGBA_S3TC_DXT5_EXT, x: X_S3TC},
  'bc3-rgba-unorm-srgb': {gl: GL.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, x: X_S3TC_SRGB},
  'bc4-r-unorm': {gl: GL.COMPRESSED_RED_RGTC1_EXT, x: X_RGTC},
  'bc4-r-snorm': {gl: GL.COMPRESSED_SIGNED_RED_RGTC1_EXT, x: X_RGTC},
  'bc5-rg-unorm': {gl: GL.COMPRESSED_RED_GREEN_RGTC2_EXT, x: X_RGTC},
  'bc5-rg-snorm': {gl: GL.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT, x: X_RGTC},
  'bc6h-rgb-ufloat': {gl: GL.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT, x: X_BPTC},
  'bc6h-rgb-float': {gl: GL.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT, x: X_BPTC},
  'bc7-rgba-unorm': {gl: GL.COMPRESSED_RGBA_BPTC_UNORM_EXT, x: X_BPTC},
  'bc7-rgba-unorm-srgb': {gl: GL.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT, x: X_BPTC},

  // WEBGL_compressed_texture_etc: device.features.has("texture-compression-etc2")
  //   Note: WebGL2 guaranteed availability compressed formats, through CPU decompression :(

  'etc2-rgb8unorm': {gl: GL.COMPRESSED_RGB8_ETC2, x: X_ETC2},
  'etc2-rgb8unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ETC2, x: X_ETC2},
  'etc2-rgb8a1unorm': {gl: GL.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2, x: X_ETC2},
  'etc2-rgb8a1unorm-srgb': {gl: GL.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2, x: X_ETC2},
  'etc2-rgba8unorm': {gl: GL.COMPRESSED_RGBA8_ETC2_EAC, x: X_ETC2},
  'etc2-rgba8unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC, x: X_ETC2},

  'eac-r11unorm': {gl: GL.COMPRESSED_R11_EAC, x: X_ETC2},
  'eac-r11snorm': {gl: GL.COMPRESSED_SIGNED_R11_EAC, x: X_ETC2},
  'eac-rg11unorm': {gl: GL.COMPRESSED_RG11_EAC, x: X_ETC2},
  'eac-rg11snorm': {gl: GL.COMPRESSED_SIGNED_RG11_EAC, x: X_ETC2},

  // X_ASTC compressed formats: device.features.has("texture-compression-astc")

  'astc-4x4-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_4x4_KHR, x: X_ASTC},
  'astc-4x4-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR, x: X_ASTC},
  'astc-5x4-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_5x4_KHR, x: X_ASTC},
  'astc-5x4-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR, x: X_ASTC},
  'astc-5x5-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_5x5_KHR, x: X_ASTC},
  'astc-5x5-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR, x: X_ASTC},
  'astc-6x5-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_6x5_KHR, x: X_ASTC},
  'astc-6x5-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR, x: X_ASTC},
  'astc-6x6-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_6x6_KHR, x: X_ASTC},
  'astc-6x6-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR, x: X_ASTC},
  'astc-8x5-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_8x5_KHR, x: X_ASTC},
  'astc-8x5-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR, x: X_ASTC},
  'astc-8x6-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_8x6_KHR, x: X_ASTC},
  'astc-8x6-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR, x: X_ASTC},
  'astc-8x8-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_8x8_KHR, x: X_ASTC},
  'astc-8x8-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR, x: X_ASTC},
  'astc-10x5-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_10x10_KHR, x: X_ASTC},
  'astc-10x5-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR, x: X_ASTC},
  'astc-10x6-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_10x6_KHR, x: X_ASTC},
  'astc-10x6-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR, x: X_ASTC},
  'astc-10x8-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_10x8_KHR, x: X_ASTC},
  'astc-10x8-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR, x: X_ASTC},
  'astc-10x10-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_10x10_KHR, x: X_ASTC},
  'astc-10x10-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR, x: X_ASTC},
  'astc-12x10-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_12x10_KHR, x: X_ASTC},
  'astc-12x10-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR, x: X_ASTC},
  'astc-12x12-unorm': {gl: GL.COMPRESSED_RGBA_ASTC_12x12_KHR, x: X_ASTC},
  'astc-12x12-unorm-srgb': {gl: GL.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR, x: X_ASTC},

  // WEBGL_compressed_texture_pvrtc

  'webgl-pvrtc-rgb4unorm': {gl: GL.COMPRESSED_RGB_PVRTC_4BPPV1_IMG, x: X_PVRTC},
  'webgl-pvrtc-rgba4unorm': {gl: GL.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, x: X_PVRTC},
  'webgl-pvrtc-rbg2unorm': {gl: GL.COMPRESSED_RGB_PVRTC_2BPPV1_IMG, x: X_PVRTC},
  'webgl-pvrtc-rgba2unorm': {gl: GL.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, x: X_PVRTC},

  // WEBGL_compressed_texture_etc1

  'webgl-etc1-rbg-unorm': {gl: GL.COMPRESSED_RGB_ETC1_WEBGL, x: X_ETC1},

  // WEBGL_compressed_texture_atc

  'webgl-atc-rgb-unorm': {gl: GL.COMPRESSED_RGB_ATC_WEBGL, x: X_ETC1},
  'webgl-atc-rgba-unorm': {gl: GL.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL, x: X_ETC1},
  'webgl-atc-rgbai-unorm': {gl: GL.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL, x: X_ETC1}
};

/** Return a list of compressed texture features */
export function getTextureFeatures(gl: WebGLRenderingContext): DeviceFeature[] {
  const features: DeviceFeature[] = [];
  for (const [feature, extensions] of TEXTURE_FEATURES) {
    if (extensions.every(extension => gl.getExtension(extension))) {
      features.push(feature);
    }
  }
  return features;
}