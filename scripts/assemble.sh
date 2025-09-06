#/usr/bin/sh

# This script assembles the given PNG images
# using the given delays and color depth
# into an animated GIF that loops infinitely.

magick \
  -delay 100 01.png \
  -delay 50 02.png \
  -delay 200 03.png \
  -delay 50 04.png \
  -delay 200 05.png \
  -delay 50 06.png \
  -delay 50 07.png \
  -delay 50 08.png \
  -delay 200 09.png \
  -delay 50 10.png \
  -delay 50 11.png \
  -delay 50 12.png \
  -delay 50 13.png \
  -delay 50 14.png \
  -delay 50 15.png \
  -delay 100 16.png \
  -delay 100 17.png \
  -delay 100 18.png \
  -delay 300 19.png \
  -loop 0 \
  -layers Optimize \
  -colors 64 \
  output.gif
