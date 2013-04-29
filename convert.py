#! /usr/bin/env python
# -*- encoding: utf-8 -*-

import sys
import re

class Convert:

  def __init__(self, lines):
    self.lines = lines

  def convert(self):
    self.parse()
    self.output()

  def parse(self):
    self.name = self.find_name()
    self.start = self.convert_start()
    
  def convert_start(self):
    old = self.find_start()
    stones = { 'B': [], 'W': [] }
    matches = re.findall('(B|W)(\[[a-z][a-z]\])', old)
    for color, pos in matches:
       stones[color].append(pos)
    return "AW%sAB%s" % (u"".join(stones['B']), u"".join(stones['W']))

  def find_name(self):
    return self.find('<param name=problem value=([^>]+)>')

  def find_start(self):
    return self.find('<param name=init value="([^"]+)">')   

  def find(self, pattern):
    for line in self.lines:
      match = re.search(pattern, line)
      if match:
        return match.group(1)

  def output(self):
    print "(;GM[1]FF[4]CA[UTF-8]AP[kursgo.pl converter]ST[2]SZ[9]"
    print self.start

    print ")"


if __name__ == "__main__":
  old_format = sys.stdin.readlines()
  conv = Convert(old_format)
  conv.convert()

