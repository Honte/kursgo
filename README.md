# Interaktywny Kurs Go

Jest to odnowiona wersja kursu Go, który przez wiele lat dostępny był na [go.art.pl](http://go.art.pl), będący jednocześnie polskim tłumaczeniem kursu ze strony [playgo.to/iwtg/en](http://playgo.to/iwtg/en/). Poprzednia wersja silnie wykorzystywała aplety Javy, które nie są już wspierane przez najnowsze przeglądarki, a na urządzeniach mobilnych całkowicie niedostępne. 

Nowa wersja kursu ma na celu zwiększenie dostępności oraz wzbogacenie kursu o nowe lekcje i materiały.
 
### Rozwój kursu

Kurs napisany jest z wykorzystaniem generatora statycznych stron internetowych - [Jekyll](https://jekyllrb.com/). 
 
W pierwszym kroku należy zainstalować interpreter języka *Ruby* oraz narzędzie [bundler](https://jekyllrb.com/tutorials/using-jekyll-with-bundler/).

Następnie trzeba doinstalować zależności projektu:
```
bundle config set --local path 'vendor/bundle'
bundle install
```
  
Uruchomienie kursu:
```
bundle exec jekyll serve
```

### Wdrożenie kursu

Należy wykorzystać, lub bazować, na skrypcie `_deploy-utils/deploy.sh`.

