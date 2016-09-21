# Interaktywny Kurs Go

Jest to odnowiona wersja kursu Go, który przez wiele lat dostępny był na [go.art.pl](http://go.art.pl), będący jednocześnie polskim tłumaczeniem kursu ze strony [playgo.to/iwtg/en](http://playgo.to/iwtg/en/). Poprzednia wersja silnie wykorzystywała aplety Javy, które nie są już wspierane przez najnowsze przeglądarki, a na urządzeniach mobilnych całkowicie niedostępne. 

Nowa wersja kursu ma na celu zwiększenie dostępności oraz wzbogacenie kursu o nowe lekcje i materiały.
 
### Instalacja

Kurs napisany jest z wykorzystaniem generatora statycznych stron internetowych - [Jekyll](https://jekyllrb.com/). 
 
W pierwszym kroku należy zainstalować interpreter języka *Ruby* i bibliotekę *Jekyll* - najlepiej przechodząć kroki opisane [tutaj](https://jekyllrb.com/docs/installation/).

Następnie trzeba doinstalować zależności projektu:
```
gem install jekyll-watch jekyll-assets
```
  
Uruchomienie kursu:
```
jekyll serve
```

Przygotowanie kursu do wdrożenia:
```
jekyll build
```
  

