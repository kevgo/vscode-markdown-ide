#!/usr/bin/env python3

# This script renames all PNG files in the current directory
# to 01.png, 02.png, etc.

import os
import glob

def rename_pngs():
    png_files = glob.glob("*.png")
    png_files.sort()

    for i, filename in enumerate(png_files, 1):
        new_name = f"{i:02d}.png"
        os.rename(filename, new_name)
        print(f"{filename} -> {new_name}")

if __name__ == "__main__":
    rename_pngs()
