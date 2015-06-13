# Fcfinder

[![Gem Version](https://badge.fury.io/rb/fcfinder.svg)](http://badge.fury.io/rb/fcfinder)

Rails İçin Web Dosya Gezgini 
CKEditor ve Tinymce ile Hızlı ve Basit bir şekilde Entegreli olarak kullanabileceğiniz dosya gezgini.

![Arayuzu](https://raw.githubusercontent.com/furkancelik/fcfinder/master/screenshots/fcfinder_interface.png)

## Gereklilikler

###ImageMagick

[imagemagick](http://github.com)'in kurulu olması gerekmektedir.

Windows Kurulumu İçin;
[imagemagick](http://github.com) adresinden download butonundan 
Windows Binary Release alanından **ruby ile uyumlu** (kurulu olan x64 x86 ile aynı)
ImageMagick-******-dll.exe Dosyasını İndirip Kurabilirsiniz kurulum işleminde path ortam değişkenine eklendiğine emin olun.

Komut Satırına

`convert -version`

yazdığınızda bu şekilde başarıyla yüklediğinizi görebilirsiniz.

```
Version: ImageMagick 6.9.1-4 Q16 x86 2015-05-31 http://www.imagemagick.org
Copyright: Copyright (C) 1999-2015 ImageMagick Studio LLC
License: http://www.imagemagick.org/script/license.php
Features:  Cipher DPC Modules OpenMP
...
```

### Puma Server (İsteğe Bağlı)
Gereklilik şartı yok ama büyük dosyaları yükleme işleminde webrick sorun çıkartabiliyor
pumanın windows için kurulumuna [buradan](https://github.com/hicknhack-software/rails-disco/wiki/Installing-puma-on-windows) bakabilirsiniz.



## Kurulum

Rails uygulamaları için Gemfile dosyanıza alttaki satırı eklemelisiniz

```ruby
gem 'fcfinder'
```

bundle install

ile rails için yükleme işlemini gerçekleştirebilirsiniz.


## Kullanım

###Controller Ayarı

```ruby
class SizinControlleriniz < ApplicationController

  def index
    if request.post?
	  # Bu Satırla Sadece Giriş Yapan Kullanıcıların (Admin'in) Finder'e erişimini Sağlayabilirsiniz
	  if session[:user_id]
		# public klasörü altında istediğiniz isimde dosya oluşturabilirsiniz örnek açısından 'uploads' şeklinde oluşturuldu
		# File.join(Rails.public_path, 'uploads', "/*")
		# Paremetre olarak listelenmesini istediğiniz dosyalar,
		# sunucu adresi,
		# post paremetrleri,
		# Hash paremetresi bu hash içerisinde
		# :max_file_size = yüklenecek dosyanın boyutunu belirtiyor (byte)
		# :allowed_mime = ekstra olarak izin vermek istediğiniz dosya tipleri
		# :disallowed_mime = izin verilmeyen dosya tipleri
        render text: Fcfinder::Connector.new(File.join(Rails.public_path, 'uploads', "/*"), request.env["HTTP_HOST"], params[:fcfinder],
                                             {
                                                 :max_file_size => 1_000_000,
                                                 :allowed_mime => {'pdf' => 'application/pdf'},
                                                 :disallowed_mime => {}
                                             }).run, :layout => false
      else
	  # session_id değeri boş ise erişimi kapatıyor dosyalarınız güvende oluyor.
        render :text => "Access not allowed!".to_json, :layout => false
      end
    else
      render :layout => false
    end
  end


  #dosya indirme işlemi için 
  def download
	# 'uploads' kısmı yine public klasörü altında olan klasörünüz.
    send_file File.join(Rails.public_path,'uploads',params[:path].split(":").join("/")+"."+params[:format])
  end
end
```
###Rata Ayarı

```ruby
scope '/fcfinder' do
  match '/', to: 'sizin_controlleriniz#index', via: [:get, :post]
  get '/download/:path', to: 'sizin_controlleriniz#download'
end
```
**Eğer bir namespace altında kullanmak isterseniz bu şekilde kullanabilirsiniz**

```ruby
namespace :admin do
  scope '/fcfinder' do
    match '/', to: 'sizin_controlleriniz#index', via: [:get, :post]
	get '/download/:path', to: 'sizin_controlleriniz#download'
  end
end 
```

###View Ayarı

**app/assets/javascripts/application.js dosyanızda **

```js
//= require jquery
//= require jquery_ujs
```

bu satırlar ekli olmalıdır ***(jQuery'nin yüklü olduğuna emin olun)***

**config/initializers/assets.rb** dosyasında en alta 

```ruby
Rails.application.config.assets.precompile += %w( fcfinder.js )
Rails.application.config.assets.precompile += %w( fcfinder.css )
```
satırlarını eklemelisiniz

**Viewdeki dosyanızın içeriği bu şekilde olmalıdır**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FcFinder</title>
    
   <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track' => true %>
   <%= javascript_include_tag 'application', 'data-turbolinks-track' => true %>
   
   <%= javascript_include_tag 'fcfinder', 'data-turbolinks-track' => true %>
   <%= stylesheet_link_tag    'fcfinder', media: 'all', 'data-turbolinks-track' => true %>
  </head>
  <body>
    <div id="fcfinder"></div>
    
	<script type="text/javascript">
      $(function(){
        $("#fcfinders").fcFinder({
			// bu değer rotada ayarladığınız adres olmalı
			url:"/fcfinder",
        getFileCallback: function(url) {
          /**
			Editör Entegre İşlemleri İlk Etap İçin Bu Değeri Boş Bırakabilirsiniz
			Varsayılan Olarak CKEditor ile Entegrebir şekilde çalışıyor
		  */   
			}
        });
      });
    </script>
  </body>
</html>
```


**Şimdi Sunucunuzu Başlatıp Test Edebilirsiniz :)**

## Entegre İşlemleri
### CKEditor

Varsayılan olarak ckeditor ile entegreli olarak geliyor. 
CKEditorün Bulunduğu Sayfada 
```js
CKEDITOR.replace( 'editor1',{
	/* Bu Şekilde CKEditorde finder yolunu belirteceksiniz. */
	filebrowserBrowseUrl : 'http://localhost:3000/fcfinder'
});
```

### Tinymce

Tinymce Editorun bulunduğu sayfada
```js
function fcFinderBrowser (field_name, url, type, win) {
        tinymce.activeEditor.windowManager.open({
		/* Finder urlsi */
        file: "http://localhost:3000/admin/fcfinder",
		title: 'FCFinder Dosya Yöneticisi',
        width: 900,
        height: 450,
        resizable: 'yes'
        }, {
            setUrl: function (url) {
				win.document.getElementById(field_name).value = url;
            }
        });
	return false;
}

tinymce.init({
		selector: "textarea#elm1",
		theme: "modern",
		file_browser_callback : fcFinderBrowser,
		....
		...
		..
		.
	});
```

**FcFinder'in bulunduğu sayfada **

```js
$("#fcfinder").fcFinder({
        url:"/admin/fcfinder",
        getFileCallback: function(url) {
		
          if (typeof(window.opener) !== 'undefined' && window.opener !== null) {
            window.opener.FCFinder.callBack(url);
            window.close();
          }

          if (typeof(top.tinymce) !== 'undefined' && typeof(top.tinymce) !== null) {
            top.tinymce.activeEditor.windowManager.getParams().setUrl(url);
            top.tinymce.activeEditor.windowManager.close();
          }

      }
});
```

### Input için Entegre İşlemi

**inputun bulunduğu sayfa**
```html
<html>
<head>
	<script type="text/javascript">
	function openFCFinder(field) {
	window.FCFinder = {
        callBack: function(url) {
            field.value = url;
        }
    };
	
	window.open('http://localhost:3000/admin/fcfinder', 'kcfinder_textbox',
        'status=0, toolbar=0, location=0, menubar=0, directories=0, ' +
        'resizable=1, scrollbars=0, width=950, height=400'
    );
}
</script>
</head>
<body>
<input type="text" readonly="readonly" onclick="openFCFinder(this)"
    value="Click here and select a file double clicking on it" style="width:600px;cursor:pointer" />
</body>
</html>
```

**Finder bulunduğu sayfa (finder paremetre ayarı)**


```js
$("#fcfinders").fcFinder({
        url:"/admin/fcfinder",
        getFileCallback: function(url) {

          if (typeof(window.opener) !== 'undefined' && window.opener !== null) {
            window.opener.FCFinder.callBack(url);
            window.close();
          }

          if (typeof(top.tinymce) !== 'undefined' && typeof(top.tinymce) !== null) {
            top.tinymce.activeEditor.windowManager.getParams().setUrl(url);
            top.tinymce.activeEditor.windowManager.close();
          }
	}
});
```

