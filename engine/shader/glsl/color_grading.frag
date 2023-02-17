#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);// 这里y就等于x/y, 因为本质是一个正方体。

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    // texture(color_grading_lut_texture_sampler, uv)

    // out_color = color;
    highp float b = color.b * _COLORS; // 因为长方形的LUT x轴方向是蓝色，所以根据b先采样大正方形RG
    highp float b_floor = floor(b);
    highp float b_ceil = ceil(b);
    // 然后采样在大正方形内采样
    highp vec4 color_floor = texture(color_grading_lut_texture_sampler, vec2((b_floor+color.r)/_COLORS, color.g));
    highp vec4 color_ceil = texture(color_grading_lut_texture_sampler, vec2((b_ceil+color.r)/_COLORS, color.g));
    out_color = mix(color_floor, color_ceil, b-b_floor);
}
