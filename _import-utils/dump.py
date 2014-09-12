#! /usr/bin/python
# -*- coding: utf-8 -*-

import codecs
import os
import oursql
import re

def process():
  conn = oursql.connect(host='127.0.0.1', user='goartpl', passwd='', db='goartpl')

  cursor = conn.cursor(oursql.DictCursor)
  cursor.execute("select nr.body, n.nid, n.title, src, dst from node n join node_revisions nr on (n.vid = nr.vid) join url_alias on (n.nid = substring(src, 6)) where dst like 'kurs/%'");

  for row in cursor:
    save(row)


def save(row):
  if not os.path.exists(row['dst']):
    os.makedirs(row['dst'])

  #save_title(row)
  withTokens = extract_applets(row)
  save_body(row, withTokens)

def save_title(row):
  with codecs.open("%s/title" % row['dst'], "w", "utf-8") as titleFile:
    titleFile.write(row['title'])

def extract_applets(row):
  applets = {}

  def gen_name(applet):
    match = re.search(r'<param name=problem value=(.*?)>', applet)
    if match:
      return match.group(1)
    return len(applets)

  def replace_applet_with_token(match):
    appletStr = match.group(1)
    name = gen_name(appletStr)
    applets[name] = appletStr
    return '{%% problem %s %%}\n{%% endproblem %%}' % name

  withTokens = re.sub(r'(<applet.*?</applet>)', 
                      replace_applet_with_token, 
                      row['body'],
                      flags = re.DOTALL)
  save_applets(row['dst'], applets)
  return withTokens

def save_body(row, withTokens):
  with codecs.open("%s/index.html" % row['dst'], "w", "utf-8") as bodyFile:
    bodyFile.write('---\n')
#    bodyFile.write('layout: lekcja\n')
    bodyFile.write('title: %s\n' % row['title'])
    bodyFile.write('---\n')
    bodyFile.write(withTokens)

def save_applets(dir, applets):
  for name, applet in applets.iteritems():
    with codecs.open("%s/%s.applet" % (dir, name), "w", "utf-8") as appletFile:
      appletFile.write(applet)



if __name__ == '__main__':
  process()
