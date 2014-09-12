#! /bin/bash

# environment variables that should be set:
# KURS_DST  - desitantion directory

if [[ -z $KURS_DST ]]; then
  echo "Environemtn variable KURS_DST must be set."
  exit 1
fi

if [[ ! -e _config.yml ]]; then
  echo "Script must be executed within directory with jekyll source tree."
  exit 1
fi

# build
jekyll build || exit 2

# copy
rsync -a --delete-delay _site/ $KURS_DST
