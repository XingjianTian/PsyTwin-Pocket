#!/usr/bin/env python3
"""
去除PNG图片白色背景，将其设为透明
处理 static/pet/ExportedSprites/ 目录下的所有 PNG 文件
"""

import os
from PIL import Image
import glob

# 配置
INPUT_DIR = 'static/pet/ExportedSprites'
THRESHOLD = 240  # 白色阈值：RGB 都大于此值视为背景


def remove_white_background(image_path):
    """去除单张图片的白色背景"""
    img = Image.open(image_path)
    
    # 确保图片是 RGBA 模式
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 获取图片数据
    datas = img.getdata()
    
    # 创建新的数据：白色/近白色像素设为透明
    new_data = []
    for item in datas:
        r, g, b, a = item
        # 如果 RGB 都大于阈值，认为是白色背景，设为透明
        if r > THRESHOLD and g > THRESHOLD and b > THRESHOLD:
            new_data.append((255, 255, 255, 0))  # 完全透明
        else:
            new_data.append(item)
    
    # 更新图片数据
    img.putdata(new_data)
    
    # 保存（覆盖原文件）
    img.save(image_path, 'PNG')
    return True


def main():
    # 查找所有 PNG 文件
    pattern = os.path.join(INPUT_DIR, '*.png')
    png_files = sorted(glob.glob(pattern))
    
    if not png_files:
        print(f'未找到 PNG 文件: {pattern}')
        return
    
    print(f'找到 {len(png_files)} 个 PNG 文件')
    print('开始去除白色背景...')
    
    processed = 0
    for i, filepath in enumerate(png_files, 1):
        try:
            remove_white_background(filepath)
            processed += 1
            if i % 50 == 0:
                print(f'  已处理 {i}/{len(png_files)}')
        except Exception as e:
            print(f'处理失败: {filepath} - {e}')
    
    print(f'完成！共处理 {processed} 个文件')


if __name__ == '__main__':
    main()
