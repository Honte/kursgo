#! /usr/bin/env python
# -*- encoding: utf-8 -*-

import sys
import re

class ParseSequence:
  def __init__(self, seq):
    self.input = seq
    self.pos = 0
    self.len = len(self.input)
    self.variants = []

  def parse(self):
    self.match(self.variants)

  def match(self, node):
    while (self.pos < self.len):
      if self.WHITESPACES():
        pass
      elif self.VAR_TOKEN():
        child = []
        self.match(child)
        node.append(child)
      elif self.MOVE_TOKEN():
        node.append(self.m)
      elif self.COMMENT_TOKEN():
        node.append(self.m)
      elif self.ENDVAR_TOKEN():
        return
      else:
        raise Exception("No match at %d" % self.pos)

  def MOVE_TOKEN(self):
    pat = re.compile('([BW])\[([a-z]{2})\],')
    m = pat.match(self.input, self.pos)
    if m:
      self.m = m.groups()
      self.pos += 6
      return True
    return False

  def VAR_TOKEN(self):
    if self.input[self.pos] == '{':
      self.pos += 1
      return True
    
  def ENDVAR_TOKEN(self):
    if self.input[self.pos] == '}':
      self.pos += 1
      return True

  def COMMENT_TOKEN(self):
    pat = re.compile('([^}]+)')
    m = pat.match(self.input, self.pos)
    if m:
      self.m = m.group(1)
      self.pos += len(self.m)
      return True
    return False

  def WHITESPACES(self):
    pat = re.compile('[ \n\t\r]+')
    m = pat.match(self.input, self.pos)
    if m:
      self.pos += len(m.group(0))
      return True
    return False


class Convert:

  def __init__(self, content):
    self.content = content

  def convert(self):
    self.parse()
    self.output()

  def parse(self):
    self.name = self.find_name()
    self.start = self.convert_start()
    self.variants = self.convert_variants()
    
  def convert_start(self):
    old = self.find_start()
    if not old:
      return  ""
    stones = { 'B': [], 'W': [] }
    matches = re.findall('(B|W)(\[[a-z][a-z]\])', old)
    for color, pos in matches:
       stones[color].append(pos)
    return "AW%sAB%s" % (u"".join(stones['W']), u"".join(stones['B']))

  def convert_variants(self):
    old = self.find_sequence()
    if old:
      parser = ParseSequence(old)
      parser.parse()
      self.sequence = parser.variants
    else:
      self.sequence = []

  def find_name(self):
    return self.find('<param name=problem value=([^>]+)>')

  def find_start(self):
    return self.find('<param name=init value="([^"]+)">')   

  def find_sequence(self):
    return self.find('<param name=sequence value ="([^"]+)">')

  def find(self, pattern):
    match = re.search(pattern, self.content)
    if match:
      return match.group(1)

  def output(self):
    print "(;GM[1]FF[4]CA[UTF-8]AP[kursgo.pl converter]ST[2]SZ[9]"
    sys.stdout.write(self.start)
    for node in self.sequence:
      self.print_node(node)
    print ")"
    
  def print_node(self, node):
    if isinstance(node, list):
      sys.stdout.write("\n(")
      for var in node:
        self.print_node(var)
      sys.stdout.write(")")
    elif isinstance(node, basestring):
      sys.stdout.write("C[%s]" % node)
    else:
      color, pos = node
      sys.stdout.write(";%s[%s]" % (color, self.convert_position(pos)))

  def convert_position(self, pos):
    if pos == 'zz':
      return 'tt'
    return pos


if __name__ == "__main__":
  old_format = sys.stdin.read()
  old_format = old_format.replace('\n', '')
  conv = Convert(old_format)
  conv.convert()

