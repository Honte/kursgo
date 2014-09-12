#! /bin/bash

if [[ -z $1 ]]; then
  echo "Syntax:"
  echo "  $0 destination_path"
  exit 1
fi

if [[ ! -e _config.yml ]]; then
  echo "Script must be executed within directory with jekyll source tree."
  exit 1
fi

# build
jekyll build || exit 2

# copy
rsync -a --delete-delay _site/ $1
