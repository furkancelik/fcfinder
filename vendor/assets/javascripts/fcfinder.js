;(function($){
    $.fn.fcFinder = function(opts) {

        //Ana Seçiciler
        var fcfinder = $(this);
        var fcfinder_selector = fcfinder.selector;
        var $body = $("body");

        //Selector Ayarı
        if(fcfinder_selector!="#fcfinder"){
            $(this).css({"margin":"0","padding":"0","display": "block","height": "100%","width": "100%"}).append('<div id="fcfinder"></div>');
            fcfinder = fcfinder.find("#fcfinder");
            fcfinder_selector = fcfinder.selector
        }

        // Varsayılan Metinler
        var i18n = {
            empty_dir               :   'Dizin Boş',
            empty_file              :   'Dosya Boş',
            loading                 :   'Yükleniyor...',
            file_size	            :	'Dosya Boyutu',
            file_name           	:	'Dosya Adı',
            file_cdate	            :	'Dosya Oluşturulma Tarihi',
            faild_process	        :	'İşlem Gerçekleşemedi',
            access_not_head		    :	'Erişim İzni Yok',
            access_not_content	    :	'Erişim İzniniz Yok Lütfen Giriş Yapmayı Deneyiniz Hala Bu Sorunla Karşılaşırsanız Lüftfen Yönetici İle Görüşünüz.',
            bottom_file			    :	'{0} Dosya ( {1} )',
            load_directory	        :  	'Dizinler Yükleniyor',
            read_permission	        :	'Okuma İzni',
            write_permission        :	'Yazma İzni',
            read_write_permission	:	'Yazma ve Okuma İzni',
            directory	            :	'Klasör',

            error   :
            {
                large_file  	        :	'Dosya Boyutu İzin Verilen Dosya Boyutundan Fazla \n İzin Verilen Dosya Boyutu: {0}',
                error_type	            :	'Yüklemeye Çalıştığınız Dosya Türüne İzin Verilmemiş \n İzin Verilen Dosya Türü(leri):\n {0}.',
                load_error	            :	'Bir Hata Meydana Geldi ve Dosya Yüklenemedi Hata Sebebi: "{0}" Olabilir.',
                select_file_error	    :	'Bir Hata Meydana Geldi ve Dosya Açılamadı, Açmaya Çalıştığınız Dosya Sunucuda Olmayabilir.',
                error_msg	            :	'Beklenmedik Bir Hata Meydana Geldi',
                download_error	        :	'Bir Hata Meydana Geldi ve Dosya İndirilemiyor Hata Sebebi: "{0}" Olabilir. \n  Dosya Arşive Eklenirken Hata Oluşmuş Olabilir Klasor Adıyla Aynı Arşiv Dosyası Olmadığından Emin Olun',
                copy_error	            :	'Bir Hata Meydana Geldi ve Koyalama İşlemi Gerçekleştirilemedi Hata Sebebi "{0}" Olabilir.',
                replace_error           : 'Bir Hata Meydana Geldi ve Dosya Değiştirilemedi İşlem İptal Edildi, Hata Sebebi "{0}" Olabilir.',
                duplicate_error	        :	'Bir Hata Meydana Geldi ve Seçtiğiniz Dosyanın Kopyası Oluşturulamadı Hata Sebebi: "{0}" Olabilir.',
                rename_error	        :	'Bir Hata Meydana Geldi ve Dosya Adı Değiştirilemedi Hata Sebebi: "{0}" Olabilir.',
                edit_error	            :	'Bir Hata Meydana Geldi, Açmaya Çalıştığınız Dosyanın Sunucuda Olmaya Bilir.',
                delete_error_0	        :	'Silmeye Çalıştığınız Dosyaya Erişilemiyor Dosya Olmayabilir.',
                delete_error_1	        :  	'Bir Hata Meydana Geldi ve Dosya Silme İşlemi Gerçekleştirilemedi Hata Sebebi: "{0}" Olabilir.',
                new_directory_error_1	:	'Bu İsimde Dosya Var',
                new_directory_error_0	:	'Bir Hata Meydana Geldi ve Klasör Oluşturulamadı, Hata Sebebi: "{0}" Olabilir.'
            },

            dialog  :
            {
                info_h	                :	'Bilgiler',
                info_size	            :	'Boyutu:',
                info_addres	            :	'Adresi:',
                info_url	            :	'Link:',
                info_cdate          	:	'Oluşturulma Tarihi:',
                info_mdate	            :	'Son Değişiklik Tarihi:',
                info_file_permission	:	'Dosya İzinleri:',
                preview_h	            :	'Önizle',
                preview_size	        :	'Boyutu:',
                preview_addres	        :	'Adresi:',
                preview_url	            :	'Link:',
                preview_cdate	        :	'Oluşturulma Tarihi:',
                preview_mdate	        :	'Son Değişiklik Tarihi:',
                file_replace_h	        :	'Dosya Değiştir veya Atla',
                file_replace_content	:	'Hedefte Zaten "{0}" Adında Bir Dosya Var Üzerine Yazılsınmı?',
                cancel	                :	'İptal Et',
                ok	                    :	'Evet',
                close	                :	'Kapat',
                delete	                :	'Sil',
                delete_h	            :	'{0} Sil',
                delete_content	        :	'{0} Kalıcı Olarak Silmek İstediğinize Eminmisiniz?',
                settings_h	            :	'Ayarlar',
                settings_icon_view	    :	'Simge Görünümü',
                settings_list_view	    :	'Liste Görünümü',
                settings_show_size	    :	'Dosya Boyutunu Göster',
                settings_show_date	    :	'Dosya Oluşturulma Tarihini Göster',
                sorter_h	            :	'Sıralama Düzenle',
                sorter_name	            :	'Ada Göre Sırala',
                sorter_size	            :	'Boyutuna Göre Sırala',
                sorter_date	            :	'Tarihe Göre Sırala',
                sorter_kind	            :	'Dosya Türüne Göre Sırala'
            },

            contextmenu :
            {
                file_open	        :	'Aç',
                file_preview	    :	'Önizle',
                file_download	    :   'İndir',
                file_copy	        :	'Kopyala',
                file_cut	        :	'Kes',
                file_duplicate	    :	'Kopyasını Oluştur',
                file_rename	        :	'Yeniden Adlandır',
                file_delete	        :   'Sil',
                file_info	        :	'Bilgiler',
                wrapper_paste	    :	'Yapıştır',
                wrapper_list_view	:	'Liste Görünümü',
                wrapper_icon_view	:	'Simge Görünümü',
                wrapper_upload	    :	'Dosya Yükle',
                wrapper_newfolder	:	'Yeni Klasör',
                wrapper_refresh	    :	'Yenile',
                wrapper_show_size	:	'Boyutu Göster / Gizle',
                wrapper_show_date	:	'Tarihi Göster / Gizle',
                wrapper_namesorter	:	'Ada Göre Sırala',
                wrapper_sizesorter	:	'Boyuta Göre Sırala',
                wrapper_datesorter	:	'Tarihe Göre Sırala',
                wrapper_kindsorter	:	'Türüne Göre Sırala'
            },

            widget_menu	:
            {
                up_folder	:	'Üst Klasor',
                upload		:	'Yükle',
                new_folder	:	'Yeni Klasor',
                refresh		:	'Yenile',
                download	:	'İndir',
                info		:	'Bilgiler',
                preview		:	'Ön İzle',
                edit		:	'Düzenle',
                copy		:	'Kopyala',
                cut			:	'Kes',
                paste		:	'Yapıştır',
                duplicate	:	'Kopyasını Oluştur',
                rename		:	'Yeniden Adlandır',
                delete		:	'Sil',
                settings	:	'Ayarlar',
                icon_view	:	'Simge Görünümü',
                list_view	:	'Liste Görünümü',
                show_size	:	'Boyutu Göster',
                show_date	:	'Oluşturulma Tarihini Göster',
                sort		:	'Sırala',
                name_sorter	:	'Ada Göre Sırala',
                size_sorter	:	'Boyuta Göre Sırala',
                date_sorter	:	'Tarihe Göre Sırala',
                kind_sorter	:	'Türüne Göre Sırala',
                about		:	'Hakkında'
            }
        };


        //Dil Seçimi
        if (typeof(opts.i18n)=="object"){
            opts.i18n = fnc.merge_options(i18n,opts.i18n);
        }else {opts.i18n = i18n; }


        //Cookies Objesi
        var Cookies = {
            setCookie : function (cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            },

            getCookie :function (cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
                }
                return "";
            }

        };


        //Sabit Fonksiyonlar Objesi
        var fnc =   {
            ajax_fnc    :   {

            },
            //fnc.prepend_dialog(opts.i18n.access_not_head,opts.i18n.access_not_content,{type:"p",dialog_class:'noclose danger',scope_class:'noclose'});
            prepend_dialog  :   function(head,content,opt){
                opt = opt || {};
                opt.scope_class = typeof (opt.scope_class)==="undefined" ? "" : " "+opt.scope_class;
                opt.dialog_class = typeof (opt.dialog_class)==="undefined" ? "" : " "+opt.dialog_class;
                var html = '<div class="dialog-scope'+opt.scope_class+'"></div><div style="display:none;" class="dialog'+opt.dialog_class+'"><h1>'+head+'</h1>';
                if (opt.type=="p"){html += '<p>'+content+'</p>'; }
                html += '</div>';
                fcfinder.prepend(html);
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
            },

            ripleClick  :   function (_class)
            {
                var ink, d, x, y;
                $body.on("click",_class,function(e){
                    if($(this).find(".ink").length === 0){
                        $(this).prepend("<span class='ink'></span>");
                    }
                    ink = $(this).find(".ink");
                    ink.removeClass("animate");
                    if(!ink.height() && !ink.width()){
                        d = Math.max($(this).outerWidth(), $(this).outerHeight());
                        ink.css({height: d, width: d});
                    }
                    x = e.pageX - $(this).offset().left - ink.width()/2;
                    y = e.pageY - $(this).offset().top - ink.height()/2;
                    ink.css({top: y+'px', left: x+'px'}).addClass("animate");
                    setTimeout(function(){ ink.remove(); fcfinder.find("span.ink").remove(); },600);
                });
            },

            merge_options   :   function(obj1,obj2){
                var obj3 = {};
                for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
                for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
                return obj3;
            },

            fcfinderresize  :   function()
            {
                fcfinder.find(".right").width(fcfinder.width()-fcfinder.find(".left").width()-15);
                fcfinder.find(".right .wrapper , .right .widget").width(fcfinder.find(".right").width()-10);
                fcfinder.find(".right").children(".wrapper").height(($body.height()-fcfinder.find(".widget").height())-43);
                fcfinder.find(".left").height($body.height()-35);
            },

            appendFiles :   function(data,type){
                type = type || "";
                if (type==""){
                    var element =ul_wrapper.find(".file_wrapper:last");
                }
                else{var element =type;}

                $.each(data.file,function(key,val){
                    var _style_type = "";
                    if (val.type == "image_file") { _style_type = "style=\"background:url('//"+val.url.replace("uploads","uploads/.thumbs")+"') no-repeat center 5px / 65% 60px \"";  }
                    element.append('<div '+_style_type+' data-kind="'+val.type+'" data-date="'+val.ctime+'" data-size="'+val.size+'" data-size_2="'+val.size_2+'" data-name="'+key+'" data-path="'+val.path+'" class="'+val.type+'"><span class="file_name">'+key+'</span><span class="file_size"'+is_show_size+'>'+val.size+'</span><span class="file_date"'+is_show_date+'>'+val.ctime+'</span></div>');
                });


                if (is_show_date == " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+32+10);}
                if (is_show_size == " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+16+10);}
                if (is_show_date == " style=\"display:block;\"" && is_show_size ==  " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+16+32+10);}

            },

            getUrlParam :   function(paramName) {
                var reParam = new RegExp('(?:[\?&]|&)' + paramName + '=([^&]+)', 'i') ;
                var match = window.location.search.match(reParam) ;

                return (match && match.length > 1) ? match[1] : '' ;
            },

            sortable    :   function(type)
            {
                if (type=="name"){ fcfinder.find(".right ul.widget li a.name_sorter").removeClass("z_a").removeClass("a_z").trigger('click'); }
                if (type=="size"){ fcfinder.find(".right ul.widget li a.size_sorter").removeClass("z_a").removeClass("a_z").trigger('click'); }
                if (type=="date"){ fcfinder.find(".right ul.widget li a.date_sorter").removeClass("z_a").removeClass("a_z").trigger('click'); }
                if (type=="kind"){ fcfinder.find(".right ul.widget li a.kind_sorter").removeClass("z_a").removeClass("a_z").trigger('click'); }
            },

            toDate  :   function(date)
            {
                if (date!=null)
                {
                    var a = date.split("/");
                    return Date.parse(a[1]+"/"+a[0]+"/"+a[2]);
                }
            },

            toInt   :   function (size)
            {
                if (size!=null)
                {
                    return parseInt(size);
                }
            }

        };






        // Cookies Tanımlamaları
        Cookies.getCookie("FCFINDER_size_show")==""?Cookies.setCookie("FCFINDER_size_show","false",60*60*24*365):'';
        Cookies.getCookie("FCFINDER_date_show")==""?Cookies.setCookie("FCFINDER_date_show","false",60*60*24*365):'';
        Cookies.getCookie("FCFINDER_sortable")==""?Cookies.setCookie("FCFINDER_sortable","kind",60*60*24*365):'';
        Cookies.getCookie("FCFINDER_view_type")==""?Cookies.setCookie("FCFINDER_view_type","icon",60*60*24*365):'';



        //HTML'yi Yükle
	$("body").append("<img src='fcfinder/copy.png' />");
        fcfinder.append('<div class="left"><div id="all_folders">'+
        '<ul class="folders">'+
        '<li><a><span class="folder">'+opts.i18n.loading+'<span class="load"></span></span>'+
        '</a></li>'+
        '</div></div>'+
        '<div class="right">'+
        '<ul class="widget">'+
        '<li><a href="fcfinder:up" title="'+opts.i18n.widget_menu.up_folder+'" class="up_folder passive">'+opts.i18n.widget_menu.up_folder+'</a></li>'+
        '<li><a title="'+opts.i18n.widget_menu.upload+'" class="upload">'+
        '<form style="opacity:0;" id="file_upload" method="post" action="" enctype="multipart/form-data">'+
        '<input class="upload_field" name="fcfinder[upload][]" style="height:31px" multiple="multiple" type="file">'+
        '<input name="fcfinder[type]" value="upload" type="hidden">'+
        '<input name="fcfinder[path]" value="" type="hidden">'+
        '</form>'+
        '</a></li>'+
        '<li><a href="fcfinder:newfolder" title="'+opts.i18n.widget_menu.new_folder+'" class="new_folder">'+opts.i18n.widget_menu.new_folder+'</a></li>'+
        '<li><a href="fcfinder:refresh" title="'+opts.i18n.widget_menu.refresh+'" class="refresh">'+opts.i18n.widget_menu.refresh+'</a></li>'+
        '<li><a href="" title="'+opts.i18n.widget_menu.download+'" class="download passive">'+opts.i18n.widget_menu.download+'</a></li>'+
        '<li><a href="fcfinder:info" title="'+opts.i18n.widget_menu.info+'" class="info passive">'+opts.i18n.widget_menu.info+'</a><div>'+
        '<ul>'+
        '<li><a href="fcfinder:preview" title="'+opts.i18n.widget_menu.preview+'" class="preview passive">'+opts.i18n.widget_menu.preview+'</a></li>'+
        '</ul>'+
        '</div></li>'+
        '<li><a href="fcfinder:edit" title="'+opts.i18n.widget_menu.edit+'" class="edit passive">'+opts.i18n.widget_menu.edit+'</a><div>'+
        '<ul>'+
        '<li><a href="fcfinder:copy" title="'+opts.i18n.widget_menu.copy+'" class="copy passive">'+opts.i18n.widget_menu.copy+'</a></li>'+
        '<li><a href="fcfinder:cut" title="'+opts.i18n.widget_menu.cut+'" class="cut passive">'+opts.i18n.widget_menu.cut+'</a></li>'+
        '<li><a href="fcfinder:paste" title="'+opts.i18n.widget_menu.paste+'" class="paste passive">'+opts.i18n.widget_menu.paste+'</a></li>'+
        '<li><a href="fcfinder:duplicate" title="'+opts.i18n.widget_menu.duplicate+'" class="duplicate passive">'+opts.i18n.widget_menu.duplicate+'</a></li>'+
        '<li><a href="fcfinder:rename" title="'+opts.i18n.widget_menu.rename+'" class="rename passive">'+opts.i18n.widget_menu.rename+'</a></li>'+
        '<li><a href="fcfinder:edit" title="'+opts.i18n.widget_menu.edit+'" class="edit passive">'+opts.i18n.widget_menu.edit+'</a></li>'+
        '</ul>'+
        '</div></li>'+
        '<li><a href="fcfinder:delete" title="'+opts.i18n.widget_menu.delete+'" class="delete passive">'+opts.i18n.widget_menu.delete+'</a></li>'+
        '<li><a href="fcfinder:settings" title="'+opts.i18n.widget_menu.settings+'" class="settings">'+opts.i18n.widget_menu.settings+'</a><div>'+
        '<ul>'+
        '<li><a href="fcfinder:iconview" title="'+opts.i18n.widget_menu.icon_view+'" class="icon_view">'+opts.i18n.widget_menu.icon_view+'</a></li>'+
        '<li><a href="fcfinder:listview" title="'+opts.i18n.widget_menu.list_view+'" class="list_view">'+opts.i18n.widget_menu.list_view+'</a></li>'+
        '<li><a data-show="'+Cookies.getCookie("FCFINDER_size_show")+'" href="fcfinder:showsize" title="'+opts.i18n.widget_menu.show_size+'" class="show_size">'+opts.i18n.widget_menu.show_size+'</a></li>'+
        '<li><a data-show="'+Cookies.getCookie("FCFINDER_date_show")+'" href="fcfinder:showdate" title="'+opts.i18n.widget_menu.show_date+'" class="show_date">'+opts.i18n.widget_menu.show_date+'</a></li>'+
        '</ul>'+
        '</div></li>'+
        '<li><a href="fcfinder:sorting" title="'+opts.i18n.widget_menu.sort+'" class="sort">'+opts.i18n.widget_menu.sort+'</a><div>'+
        '<ul>'+
        '<li><a href="fcfinder:namesorter" title="'+opts.i18n.widget_menu.name_sorter+'" class="name_sorter">'+opts.i18n.widget_menu.name_sorter+'</a></li>'+
        '<li><a href="fcfinder:sizesorter" title="'+opts.i18n.widget_menu.size_sorter+'" class="size_sorter">'+opts.i18n.widget_menu.size_sorter+'</a></li>'+
        '<li><a href="fcfinder:datesorter" title="'+opts.i18n.widget_menu.date_sorter+'" class="date_sorter">'+opts.i18n.widget_menu.date_sorter+'</a></li>'+
        '<li><a href="fcfinder:kindsorter" title="'+opts.i18n.widget_menu.kind_sorter+'" class="kind_sorter">'+opts.i18n.widget_menu.kind_sorter+'</a></li>'+
        '</ul>'+
        '</div></li>'+
        '<li><a href="fcfinder:settings" title="'+opts.i18n.widget_menu.about+'" class="about">'+opts.i18n.widget_menu.about+'</a></li>'+
        '</ul>'+
        '<ul class="wrapper">'+
        '<li>'+opts.i18n.loading+'<span class="load"></span></li>'+
        '</ul>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<ul class="bottom">'+opts.i18n.loading+'<span class="load"></span></ul>');

        //Görünüm Tipini Seç
        if (Cookies.getCookie("FCFINDER_view_type")=="icon"){
            fcfinder.find(".right ul.widget li a.icon_view").addClass("passive");
            fcfinder.find(".right ul.wrapper").addClass("icon_view");
        }
        else{
            fcfinder.find(".right ul.widget li a.list_view").addClass("passive");
            fcfinder.find(".right ul.wrapper").addClass("list_view");
        }



        //Dosya Boyutu ve Tarihi Görünüyormu
        var is_show_size = Cookies.getCookie("FCFINDER_size_show")=="true"?" style=\"display:block;\"":"";
        var is_show_date = Cookies.getCookie("FCFINDER_date_show")=="true"?" style=\"display:block;\"":"";




        //Çok Kullanılan Elementler
        var ul_folders = fcfinder.children(".left").children("#all_folders").children("ul.folders");
        var ul_wrapper = fcfinder.children(".right").children("ul.wrapper");



        //Dosyaları Yükle
        $.ajax({url:opts.url,dataType:'json',type:'POST',success:function(_data) {
            //İzin Yoksa Hata Ver
            if (_data == "Access not allowed!") {

                fnc.prepend_dialog(opts.i18n.access_not_head,opts.i18n.access_not_content,{type:"p",dialog_class:'noclose danger',scope_class:'noclose'});
                fcfinder.find(".left #all_folders").html("");
                fcfinder.find(".right ul.wrapper").html("");
                fcfinder.find("ul.bottom").html("");
            }
            else{
                //İzin Varsa Dosyaları Yükle
                if (fcfinder.find("ul.bottom li[data-path='fcdir:/']").size()===0){
                    fcfinder.find("ul.bottom").html("").append('<li data-path="fcdir:/">'+opts.i18n.bottom_file.format(_data[1],_data[2])+'</li>');}
                var data = _data[0];
                var main_file_path = data.main_file.path;

                var main_class = data.main_file.sub_dir ? " opened " : " ";
                ul_folders.html("").append('<li><a id="true" href="fcdir:/" data-show="true" class="active">' +
                '<span class="braca'+main_class+'"></span>'+
                '<span class="folder">'+main_file_path+'</span>'+
                '</a></li>');

                if($.isEmptyObject(data.directory) &&  $.isEmptyObject(data.file))
                {
                    ul_wrapper.html("").append('<li class="file_wrapper" data-show="true" data-path="fcdir:/">'+opts.i18n.empty_file+'</li>');
                }else
                {
                    ul_wrapper.html("").append('<li class="file_wrapper" data-show="true" data-path="fcdir:/"></li>');
                }

                ul_folders.children("li").append('<ul class="folders"></ul>');


                $.each(data.directory,function(key,val){
                    ul_wrapper.find(".file_wrapper:first").append('<div data-path="'+val.path+'" data-name="'+key+'" data-size="'+val.size+'" data-size_2="'+val.size_2+'" data-date="'+val.ctime+'" data-kind="'+val.type+'" class="directory"><span class="file_name">'+key+'</span><span class="file_size"'+is_show_size+'>'+val.size+'</span><span class="file_date"'+is_show_date+'>'+val.ctime+'</span></div>');

                    var ths_cls = val.sub_dir? " closed " : "";
                    ul_folders.children("li").children("ul.folders").append('<li><a href="'+val.path+'">'+
                    '<span class="braca'+ths_cls+'"></span>'+
                    '<span class="folder">'+key+'</span>'+
                    '</a></li>');
                });
                fnc.appendFiles(data);
                fnc.sortable(Cookies.getCookie("FCFINDER_sortable"));
                if (Cookies.getCookie("FCFINDER_view_type")=="list"){fcfinder.find(".right ul.wrapper li[data-show='true']").prepend('<div class="list_head"><span class="file_name">'+opts.i18n.file_name+'</span><span class="file_size">'+opts.i18n.file_size+'</span><span class="file_date">'+opts.i18n.file_cdate+'</span></div>');}
                if (fcfinder.find(".left #all_folders ul.folders li a.active").attr("href")!="fcdir:/"){ fcfinder.find(".right ul.widget li a.up_folder").removeClass("passive");}
                else{fcfinder.find(".right ul.widget li a.up_folder").addClass("passive");}
            }


        }});



        //Yükleme İnputu Seçilince Formu Submit Et
        $body.on("change",fcfinder_selector+" input.upload_field",function(){
            fcfinder.find("input[name='fcfinder[path]']").val(fcfinder.find(".left #all_folders ul li a.active").attr("href"));
            $(this).closest('form').trigger('submit');
        });




        //Form Submit Ediliyor
        $body.on("submit",fcfinder_selector+" form#file_upload",function(){
            var formData = new FormData(this);
            $.ajax({url:opts.url,dataType:'json',processData: false,contentType: false,type:'POST',data:formData,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            if (fcfinder.find("#progress").length === 0) {
                                fcfinder.prepend($("<div><dt/><dd/></div>").attr("id", "progress"));
                            }
                            fcfinder.find("#progress").css({width: percentComplete * 100 + '%'});
                            if (percentComplete === 1) {
                                fcfinder.find("#progress").width("101%").delay(100).fadeOut(300, function() {
                                    $(this).remove();
                                });
                            }
                        }
                    }, false);
                    xhr.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            fcfinder.find('#progress').css({
                                width: percentComplete * 100 + '%'
                            });
                        }
                    }, false);
                    return xhr;
                },
                success:function(data) {
                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else{
                        if (data[1]=="0"){
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.large_file.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                        if (data[1]=="-1"){
                            var txt = [];
                            $.each(data[2],function(k,v){
                                txt.push(v[0]);
                            });
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.error_type.format(txt.join(", ")),{type:"p",dialog_class:'danger'});
                        }
                        else{
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.load_error.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                    }
                }
            });

            //upload_files
            return false;
        });


        //Dosyalar Çift Tıklandığında (Seçilme İşlemi)
        $body.on("dblclick",fcfinder_selector+" .right ul.wrapper li div",function(){
            var path = $(this).attr("data-path");
            if (fcfinder.find(".left #all_folders ul.folders li a[href='"+path+"']").size()>0){
                fcfinder.find(".left #all_folders ul.folders li a[href='"+path+"']").trigger("click");
            }else{
                var data = 'fcfinder[path]='+path+'&fcfinder[type]=path_to_url';
                $.ajax({url:opts.url,dataType:'json',type:'POST',data:data,success:function(data) {
                    if (data[0]=="true"){ var url = "//"+data[1];
                        //CKEditor ise
                        var funcNum = fnc.getUrlParam('CKEditorFuncNum');
                        if (funcNum>0)
                        {
                            window.opener.CKEDITOR.tools.callFunction(funcNum, url);
                            window.close();
                        }else
                        {
                            //Değilse getFileCallback Fonksiyonunu Çağır
                            if (typeof (opts.getFileCallback) == "function" && opts.getFileCallback)
                            {
                                opts.getFileCallback(url);
                            }
                        }
                    }
                    else{
                        fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.select_file_error,{type:"p",dialog_class:'danger'});
                    }
                }});
            }
            if (fcfinder.find(".left #all_folders ul.folders li a.active").attr("href")!="fcdir:/"){ fcfinder.find(".right ul.widget li a.up_folder").removeClass("passive");}
            else{fcfinder.find(".right ul.widget li a.up_folder").addClass("passive");}
        });




        //Klasör Ağacından Klasör Seçildiğinde
        $body.on("click",fcfinder_selector+" ul.folders a",function(){
            var ths = $(this);
            var url = ths.attr("href");
            var id = ths.attr("id");
            var data_path = ths.attr("href");


            fcfinder.find(".right ul.wrapper li.file_wrapper").attr("data-show","false").hide();
            fcfinder.find(".right ul.wrapper li.file_wrapper[data-path='" + data_path + "']").attr("data-show","true").show();
            fcfinder.find("ul.folders li a").removeClass("active");
            ths.addClass("active").attr("data-show","true");
            fcfinder.find("ul.bottom li").hide();
            fcfinder.find("ul.bottom li[data-path='"+url+"']").show();



            if (id!="true" && id!="false"){

                if (ths.children("span.braca").hasClass("closed")){
                    ths.children("span.braca").removeClass("closed").addClass("opened");
                }

                ths.parent("li").append('<span class="folder_load">'+opts.i18n.load_directory+'</span>');

                var data = 'fcfinder[url]='+url+'&fcfinder[type]=all_file_list';
                $.ajax({url:opts.url,dataType:'json',type:'POST',data:data,success:function(_data) {

                    if (fcfinder.find("ul.bottom li[data-path='"+url+"']").size()===0){
                        fcfinder.find("ul.bottom").append('<li data-path="'+url+'">'+opts.i18n.bottom_file.format(_data[1],_data[2])+'</li>');}
                    else { fcfinder.find("ul.bottom li").hide(); fcfinder.find("ul.bottom li[data-path='"+url+"']").show();}

                    var data = _data[0];
                    if (!$.isEmptyObject(data.directory))
                    {
                        ths.parent("li").append("<ul class=\"folders\"></ul>");
                        $.each(data.directory,function(key,val){
                            var ths_cls = val.sub_dir? " closed " : "";
                            ths.parent("li").children("ul.folders").append('<li><a href="'+val.path+'">'+
                            '<span class="braca '+ths_cls+'"></span>'+
                            '<span class="folder">'+key+'</span>'+
                            '</a></li>');
                        });
                    }

                    if ($.isEmptyObject(data.directory) && $.isEmptyObject(data.file))
                    {
                        fcfinder.find(".right ul.wrapper li.file_wrapper").hide();
                        if (ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").size()=="0"){
                            ul_wrapper.append('<li class="file_wrapper" data-show="true" data-path="'+data_path+'">'+opts.i18n.empty_dir+'</li>').show();
                        }else{
                            ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").show();
                        }
                        ths.removeAttr("id").removeAttr("data-show");
                    }else {
                        fcfinder.find(".right ul.wrapper li.file_wrapper").hide();
                        if (ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").size()=="0"){
                            ul_wrapper.append('<li class="file_wrapper" data-show="true" data-path="'+data_path+'"></li>').show();
                        }else{
                            ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").show();
                        }

                        if (ul_wrapper.find(".file_wrapper:last").html()!=""){ul_wrapper.find(".file_wrapper:last").html("");}
                        $.each(data.directory,function(key,val){
                            ul_wrapper.find(".file_wrapper:last").append('<div data-path="'+val.path+'" data-name="'+key+'" data-size="'+val.size+'" data-size_2="'+val.size_2+'" data-kind="'+val.type+'" data-date="'+val.ctime+'" class="directory"><span class="file_name">'+key+'</span><span class"file_size"'+is_show_size+'>'+val.size+'</span><span class="file_date"'+is_show_date+'>'+val.ctime+'</span></div>');
                        });

                        fnc.appendFiles(data);
                        fnc.sortable(Cookies.getCookie("FCFINDER_sortable"));
                        if (Cookies.getCookie("FCFINDER_view_type")=="list"){fcfinder.find(".right ul.wrapper li[data-show='true']").prepend('<div class="list_head"><span class="file_name">'+opts.i18n.file_name+'</span><span class="file_size">'+opts.i18n.file_size+'</span><span class="file_date">'+opts.i18n.file_cdate+'</span></div>');}
                    }

                    ths.next("span.folder_load").remove();

                }});
                ths.attr("id","true");
            }

            if (fcfinder.find(".left #all_folders ul.folders li a.active").attr("href")!="fcdir:/"){ fcfinder.find(".right ul.widget li a.up_folder").removeClass("passive");}
            else{fcfinder.find(".right ul.widget li a.up_folder").addClass("passive");}
            return false;
        });


        //Dosyaya yada Klasöre Tıklandığında
        $body.on("click",fcfinder_selector+" .right ul.wrapper li div",function(){
            var ths = $(this);
            if (ths.attr("class")!="list_head"){
                fcfinder.find(".right ul.wrapper li div").removeClass("active");
                ths.addClass("active");

                if (fcfinder.find("ul.bottom li[data-name='"+ths.attr("data-path")+"']").size()===0){
                    fcfinder.find("ul.bottom li").hide();
                    fcfinder.find("ul.bottom").append('<li style="display:block;" data-name="'+ths.attr("data-path")+'">'+ths.attr("data-name")+' ( '+ths.attr("data-size")+', '+ths.attr("data-date")+' )</li>');}
                else { fcfinder.find("ul.bottom li").hide(); fcfinder.find("ul.bottom li[data-name='"+ths.attr("data-path")+"']").show();}

                if (fcfinder.find(".right ul.wrapper li div.active").attr("data-new")!="new_folder")
                {if (fcfinder.find(".right ul.wrapper li div.active").attr("data-kind")=="image_file"){fcfinder.find(".right ul.widget li a.edit").removeClass("passive"); }
                    fcfinder.find(".right ul.widget li a.download , " +
                    ".right ul.widget li a.info , " +
                    ".right ul.widget li a.preview , " +
                        //".right ul.widget li a.edit , " +
                    ".right ul.widget li a.copy , " +
                    ".right ul.widget li a.cut , " +
                        //".right ul.widget li a.paste  , " +
                    ".right ul.widget li a.duplicate , " +
                    ".right ul.widget li a.rename , " +
                    ".right ul.widget li a.delete").removeClass("passive");
                }
            }

        });

        //Klasör Ağacında Artı yada Eksiye Basıldığında
        $body.on("click",fcfinder_selector+' .left #all_folders ul.folders li a span.braca',function(){

            var ths = $(this);
            var _ths = $(this).parent("a");
            var id = _ths.attr("id");


            if (id=="true"){
                _ths.next("ul.folders").hide();
                _ths.attr("id","false");


            }
            else if(id=="false"){
                _ths.next("ul.folders").show();
                _ths.attr("id","true");

            }


            fcfinder.find("ul.folders li a").removeClass("active");
            _ths.addClass("active");

            if (ths.hasClass("closed")){
                ths.removeClass("closed").addClass("opened");
            }else {
                ths.removeClass("opened").addClass("closed");
            }

            if (fcfinder.find(".left #all_folders ul.folders li a.active").attr("href")!="fcdir:/"){ fcfinder.find(".right ul.widget li a.up_folder").removeClass("passive");}
            else{fcfinder.find(".right ul.widget li a.up_folder").addClass("passive");}
        });


        //Dosya Boyutu Göster / Gizle
        $body.on("click",fcfinder_selector+" .right ul.widget li a.show_size",function(){
            if (Cookies.getCookie('FCFINDER_view_type')=="icon"){
                var show = $(this).attr("data-show");
                if (show=="false") {
                    fcfinder.find(".right ul.wrapper li div span.file_size").css({"display":"block"});
                    fcfinder.find(".right ul.wrapper li div").height(fcfinder.find(".right ul.wrapper li div").height()+16);
                    $(this).attr("data-show","true");
                    Cookies.setCookie("FCFINDER_size_show","true",60*60*24*365);
                    is_show_size = fcfinder.find(".right ul.widget li a.show_size").attr("data-show")=="true"?" style=\"display:block;\"":"";
                }
                else {
                    fcfinder.find(".right ul.wrapper li div span.file_size").hide();
                    fcfinder.find(".right ul.wrapper li div").height(fcfinder.find(".right ul.wrapper li div").height()-16);
                    $(this).attr("data-show","false");
                    Cookies.setCookie("FCFINDER_size_show","false",60*60*24*365);
                    is_show_size = fcfinder.find(".right ul.widget li a.show_size").attr("data-show")=="false"?" style=\"display:block;\"":"";
                }
            }
            return false;
        });


        //Dosya Tarihi Göster / Gizle
        $body.on("click",fcfinder_selector+" .right ul.widget li a.show_date",function(){
            if (Cookies.getCookie('FCFINDER_view_type')=="icon"){
                var show = $(this).attr("data-show");
                if (show=="false") {
                    fcfinder.find(".right ul.wrapper li div span.file_date").css({"display":"block"});
                    fcfinder.find(".right ul.wrapper li div").height(fcfinder.find(".right ul.wrapper li div").height()+32);
                    $(this).attr("data-show","true");
                    Cookies.setCookie("FCFINDER_date_show","true",60*60*24*365);
                    is_show_date = fcfinder.find(".right ul.widget li a.show_date").attr("data-show")=="true"?" style=\"display:block;\"":"";

                }
                else {
                    fcfinder.find(".right ul.wrapper li div span.file_date").hide();
                    fcfinder.find(".right ul.wrapper li div").height(fcfinder.find(".right ul.wrapper li div").height()-32);
                    $(this).attr("data-show","false");
                    Cookies.setCookie("FCFINDER_date_show","false",60*60*24*365);
                    is_show_date = fcfinder.find(".right ul.widget li a.show_date").attr("data-show")=="false"?" style=\"display:block;\"":"";
                }
            }
            return false;
        });

        //Yeni Klasör Oluşturma
        $body.on("click",fcfinder_selector+" .right ul.widget li a.new_folder",function(){
            var dir = fcfinder.find(".right ul.wrapper li[data-show='true']");
            if (dir.html()==opts.i18n.empty_dir){dir.html("");}
            fcfinder.find(".right ul.wrapper li div").removeClass("active");
            var html = '<div data-new="new_folder" data-path="" data-name="" data-size="0" data-size_2="0" data-date="" data-kind="_directory" class="active directory"><span class="file_name"><form id="new_directory"><input type="text" name="fcfinder[directory_name]" /><input type="hidden" name="fcfinder[type]" value="create_directory"/> <input type="hidden" name="fcfinder[path]" value="'+dir.attr("data-path")+'"></form></span><span class="file_size"></span><span class="file_date"></span></div>';
            if (Cookies.getCookie('FCFINDER_view_type')=="list"){
                dir.find(".list_head").after(html);
            }else {
                dir.prepend(html);
            }
            dir.find("input").select();

            return false;
        });

        //Sayfa Yenileme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.refresh",function(){
            var left_wrapper = fcfinder.find(".left #all_folders ul li a.active");
            var right_wrapper =  fcfinder.find(".right  ul.wrapper li.file_wrapper[data-show='true']");
            if (right_wrapper.attr("data-path") == left_wrapper.attr("href")){
                var path = right_wrapper.attr("data-path");
                var data = "fcfinder[type]=refresh&fcfinder[path]="+path;
                left_wrapper.next("ul").html("")
                right_wrapper.html("")
                $.ajax({url:opts.url,dataType:'json',type:'POST',data:data,success:function(data) {

                    if ($.isEmptyObject(data.directory) && $.isEmptyObject(data.file))
                    {
                        right_wrapper.html(opts.i18n.empty_dir);
                    }else {
                        if (right_wrapper.html()!=""){right_wrapper.html("");}
                        $.each(data.directory,function(key,val){
                            var ths_cls = val.sub_dir? " closed " : "";
                            left_wrapper.next("ul.folders").append('<li><a href="'+val.path+'">'+
                            '<span class="braca '+ths_cls+'"></span>'+
                            '<span class="folder">'+key+'</span>'+
                            '</a></li>');

                            right_wrapper.append('<div data-path="'+val.path+'" data-kind="'+val.type+'" data-name="'+key+'" data-size="'+val.size+'" data-size_2="'+val.size_2+'" data-date="'+val.ctime+'" class="directory"><span class="file_name">'+key+'</span><span class="file_size"'+is_show_size+'>'+val.size+'</span><span class="file_date"'+is_show_date+'>'+val.ctime+'</span></div>');
                        });

                        fnc.appendFiles(data,right_wrapper);
                        fnc.sortable(Cookies.getCookie("FCFINDER_sortable"));
                        if (Cookies.getCookie("FCFINDER_view_type")=="list"){fcfinder.find(".right ul.wrapper li[data-show='true']").prepend('<div class="list_head"><span class="file_name">'+opts.i18n.file_name+'</span><span class="file_size">'+opts.i18n.file_size+'</span><span class="file_date">'+opts.i18n.file_cdate+'</span></div>');}
                    }
                }});
            }else {
                fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.error_msg,{type:"p",dialog_class:'danger'});
            }

            return false;
        });



        //Dosya İndirme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.download",function(){
            if (!$(this).hasClass("passive")){
                var path = fcfinder.find(".right ul.wrapper li div.active").attr("data-path").replace("fcdir:/","");
                var data = "fcfinder[type]=download&fcfinder[path]="+fcfinder.find(".right ul.wrapper li div.active").attr("data-path");
                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {

                        if (data[0]=="false"){
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.download_error.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                        else{
                            window.open(location+"/download/"+data.file);
                            fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        }
                    }});
            }
            return false;
        });





        //Üst Dizin'e Çıkma
        $body.on("click",fcfinder_selector+" .right ul.widget li a.up_folder",function(){
            if (!$(this).hasClass("passive")){
                var up_path = fcfinder.find(".left  #all_folders ul.folders li a.active").attr("href").split("/");
                up_path.pop();
                var data_path = up_path.length > 1 ? up_path.join("/") : up_path[0]+"/";
                var ths = fcfinder.find(".left #all_folders ul.folders li a[href='"+data_path+"']");
                if (data_path=="fcdir:/"){$(this).addClass("passive");}
                fcfinder.find(".right ul.wrapper li.file_wrapper").attr("data-show","false").hide();
                fcfinder.find(".right ul.wrapper li.file_wrapper[data-path='" + data_path + "']").attr("data-show","true").show();
                fcfinder.find("ul.folders li a").removeClass("active");
                ths.addClass("active").attr("data-show","true");

                if (fcfinder.find("ul.bottom li[data-path='"+data_path+"']").size()===0){
                    fcfinder.find("ul.bottom li").hide();}
                else { fcfinder.find("ul.bottom li").hide(); fcfinder.find("ul.bottom li[data-path='"+data_path+"']").show();}

                fcfinder.find(".right ul.widget li a.refresh").trigger("click");
            }
            return false;
        });



        //Dosya Bilgilerini Göster
        $body.on("click",fcfinder_selector+" .right ul.widget li a.info",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var kind = file.attr("data-kind");
                var data = "fcfinder[type]=info&fcfinder[file]="+file.attr("data-path")+"&kind="+kind;
                fnc.prepend_dialog(opts.i18n.dialog.info_h,opts.i18n.loading,{type:"p"});
                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {

                        var permissions="";
                        var _class = "";
                        if (data.permissions.read == "true"){ permissions = opts.i18n.read_permission; }
                        if (data.permissions.write == "true"){ permissions = opts.i18n.write_permission; }
                        if (data.permissions.write == "true" && data.permissions.read == "true"){ permissions = opts.i18n.read_write_permission; }
                        if (data.mime_type == "directory") { data.mime_type = opts.i18n.directory; _class = " directory"; }
                        else { _class = " "+file.removeClass("active").attr("class");
                            file.addClass("active");}
                        $(fcfinder_selector).find(".dialog").html('<h1>'+opts.i18n.dialog.info_h+'</h1>' +
                        '<div class="file_bg'+_class+'" style=\''+file.attr("style")+'\'></div>'+
                        '<span class="file_name">'+file.attr("data-name")+'</span><span class="file_type">'+data.mime_type+'</span>'+
                        '<ul class="file_info">' +
                        '<li><span>'+opts.i18n.dialog.info_size+'</span>'+data.size+'</li>' +
                        '<li><span>'+opts.i18n.dialog.info_addres+'</span>'+data.path+'</li>' +
                        '<li><span>'+opts.i18n.dialog.info_url+'</span><a target="_blank" href="//'+data.url+'">'+file.attr("data-name")+'</a></li>' +
                        '<li><span>'+opts.i18n.dialog.info_cdate+'</span>'+data.ctime+'</li>' +
                        '<li><span>'+opts.i18n.dialog.info_mdate+'</span>'+data.mtime+'</li>' +
                        '<li><span>'+opts.i18n.dialog.info_file_permission+'</span>'+permissions+'</li>' +
                        '</ul>' +
                        '<a href="#" class="close">'+opts.i18n.dialog.close+'</a>');
                        fnc.fcfinderresize();
                    }});
            }
            return false;
        });


        //Dosyayı Önizle
        $body.on("click",fcfinder_selector+" .right ul.widget li a.preview",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var kind = file.attr("data-kind");
                var data = "fcfinder[type]=preview&fcfinder[file]="+file.attr("data-path")+"&kind="+kind;
                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                '<div style="display: none;" class="dialog"><h1>'+opts.i18n.dialog.preview_h+'</h1>' +
                '<p>'+opts.i18n.loading+'<span class="load"></span> </p>' +
                '</div>');
                fcfinder.find(".dialog").fadeIn(300);
                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {

                        var _class = "";
                        if (data.mime_type == "directory") { data.mime_type = opts.i18n.directory; _class = " directory"; }
                        else { _class = " "+file.removeClass("active").attr("class");
                            file.addClass("active");}

                        if (kind == "image_file"){
                            $(fcfinder_selector).find(".dialog").html('<h1>'+file.attr("data-name")+'</h1>' +
                            '<img style="width:'+$(window).width()/4+'px;" class="preview" src="//'+data.url+'" />' +
                            '<div class="clear"></div>'+
                            '<a href="#" class="close">'+opts.i18n.dialog.close+'</a>' +
                            '<div class="clear"></div>');
                            var img_width = fcfinder.find(".dialog img").width();
                            fcfinder.find(".dialog").css({"width":img_width+100+"px"});
                            fcfinder.find(".dialog").ortala();
                        }
                        else{
                            $(fcfinder_selector).find(".dialog").html('<h1>'+opts.i18n.dialog.preview_h+'</h1>' +
                            '<div class="file_bg'+_class+'" style="'+file.attr("style")+'"></div>'+
                            '<span class="file_name">'+file.attr("data-name")+'</span><span class="file_type">'+data.mime_type+'</span>'+
                            '<ul class="file_info">' +
                            '<li><span>'+opts.i18n.dialog.preview_size+'</span>'+data.size+'</li>' +
                            '<li><span>'+opts.i18n.dialog.preview_addres+'</span>'+data.path+'</li>' +
                            '<li><span>'+opts.i18n.dialog.preview_url+'</span><a target="_blank" href="//'+data.url+'">'+file.attr("data-name")+'</a></li>' +
                            '<li><span>'+opts.i18n.dialog.preview_cdate+'</span>'+data.ctime+'</li>' +
                            '<li><span>'+opts.i18n.dialog.preview_mdate+'</span>'+data.mtime+'</li>' +
                            '</ul>' +
                            '<a href="#" class="close">'+opts.i18n.dialog.close+'</a>');
                            fcfinder.find(".dialog").ortala();
                        }
                    }});
                fnc.fcfinderresize();
            }
            return false;
        });

        //Dosya Kopyala
        $body.on("click",fcfinder_selector+" .right ul.widget li a.copy",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var copy_file_path = file.attr("data-path");
                if (fcfinder.find("#copy_form").size()>0){ fcfinder.find("#copy_form").remove(); }
                fcfinder.append('<form id="copy_form"><input type="hidden" name="copy_file_path" value="'+copy_file_path+'" /><input type="hidden" name="copy_type" value="copy" /></form>');
                fcfinder.find(".right ul.widget li a.paste").removeClass("passive");
            }
            return false;
        });


        //Dosya Kesme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.cut",function(){
            if (!$(this).hasClass("passive")){
                fcfinder.find(".right ul.wrapper li div").removeClass("cutting");
                var file = fcfinder.find(".right ul.wrapper li div.active");
                file.addClass("cutting");
                var copy_file_path = file.attr("data-path");
                if (fcfinder.find("#copy_form").size()>0){ fcfinder.find("#copy_form").remove(); }
                fcfinder.append('<form id="copy_form"><input type="hidden" name="copy_file_path" value="'+copy_file_path+'" /><input type="hidden" name="copy_type" value="cut" /></form>');
                fcfinder.find(".right ul.widget li a.paste").removeClass("passive");
            }
            return false;
        });

        //Dosya Yapıştırma
        $body.on("click",fcfinder_selector+" .right ul.widget li a.paste",function(){
            var $ths = $(this);
            if (!$ths.hasClass("passive")){
                var $input = fcfinder.find("input[name='copy_file_path']");
                var $type = fcfinder.find("input[name='copy_type']").val();
                var copy_file_path = $input.val();
                var this_folder_path = fcfinder.find(".left #all_folders ul.folders li a.active").attr("href");
                var data;
                var data_input;
                if ($type=="copy"){
                    data = "fcfinder[type]=copy&fcfinder[copy_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;
                    data_input = "fcfinder[type]=copy!&fcfinder[copy_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;
                }
                if ($type=="cut") {
                    data = "fcfinder[type]=cut&fcfinder[cut_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;
                    data_input = "fcfinder[type]=cut!&fcfinder[cut_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;
                }

                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data){

                        if (data[0]=="true")
                        {if (fcfinder.find(".right ul.wrapper li div.cutting")){fcfinder.find(".right ul.wrapper li div.cutting").remove(); }
                            fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        }else {
                            if (data[1] == "0"){
                                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                                '<div style="display: none;" class="dialog"><h1>'+opts.i18n.dialog.file_replace_h+'</h1>' +
                                '<p>'+opts.i18n.dialog.file_replace_content.format(copy_file_path.split("/").pop()) +
                                '<input type="hidden" name="data_input" value="'+data_input+'" /> </p>' +
                                '<a class="close" href="#">'+opts.i18n.dialog.cancel+'</a>' +
                                '<a class="btn file_copy_ok" href="#">'+opts.i18n.dialog.ok+'</a>' +
                                '</div>');
                                fcfinder.find(".dialog").fadeIn(300);
                                fcfinder.find(".dialog").ortala();
                            }
                            else{
                                fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.copy_error.format(data[2]),{type:"p",dialog_class:'danger'});
                            }
                        }
                    }});
                $input.remove();
                $ths.addClass("passive");

            }
            return false;
        });


        //Dosya Yapıştırma (Aynı İsimde Dosya Değiştirme)
        $body.on("click",fcfinder_selector+" .dialog a.file_copy_ok",function(){
            var data = fcfinder.find(".dialog input[name='data_input']").val();
            $.ajax({
                url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data){

                    if (data[0]=="true")
                    {if (fcfinder.find(".right ul.wrapper li div.cutting")){fcfinder.find(".right ul.wrapper li div.cutting").remove(); }
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else {
                        fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.replace_error.format(data[2]),{type:"p",dialog_class:'danger'});
                    }
                }});
            return false;
        });



        //Dosya Kopyasını Oluşturma
        $body.on("click",fcfinder_selector+" .right ul.widget li a.duplicate",function(){
            if (!$(this).hasClass("passive")){
                var file_path = fcfinder.find(".right ul.wrapper li div.active").attr("data-path");
                var data = "fcfinder[type]=duplicate&fcfinder[file_path]="+file_path;
                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data){

                        if (data[0]=="true")
                        {
                            fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        }else
                        {
                            //Kopyası Oluşmadı
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.duplicate_error.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                    }});

            }
            return false;
        });



        //Dosya Yeniden Adlandırma
        $body.on("click",fcfinder_selector+" .right ul.widget li a.rename",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                file.attr("data-rename","true");
                file.children("span.file_name").html('<form id="file_rename"><input type="text" id=\"file_name\" data-value="'+file.children("span.file_name").html()+'" name="fcfinder[file_name]" value="'+file.children("span.file_name").html()+'" /><input type="hidden" name="fcfinder[type]" value="file_rename"/> <input type="hidden" name="fcfinder[path]" value="'+file.attr("data-path")+'"></form>');

                var field = file.find("span.file_name form input[name='fcfinder[file_name]']");
                if (file.hasClass("directory")){
                    field.select();
                }else{

                    field[0].focus();
                    field[0].setSelectionRange(0,(field.val().length-(field.val().split(".").slice(-1).toString().length+1)));
                }


            }
            return false;
        });



        //Dosya Yeniden Adlandırma Form Submit
        $body.on("submit",fcfinder_selector+" #file_rename",function(){
            var data = $(this).serialize();
            $.ajax({
                url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else {
                        //Bir hata meydana geldi adı değiştirilemedi
                        fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.rename_error.format(data[2]),{type:"p",dialog_class:'danger'});
                    }
                }});
            return false;
        });


        //Dosya Düzenleme (pixlr)
        $body.on("click",fcfinder_selector+" .right ul.widget li a.edit",function(){
            if (!$(this).hasClass("passive")){
                var data = "fcfinder[type]=edit_file&fcfinder[file_path]="+fcfinder.find(".right ul.wrapper li div.active").attr("data-path");
                $.ajax({
                    url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {

                        if (data[0]=="false"){
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.edit_error,{type:"p",dialog_class:'danger'});
                        }else {
                            window.open("http://apps.pixlr.com/editor/?s=c&image="+encodeURIComponent(data.url)+"&title="+encodeURIComponent(data.title));
                        }
                    }});
            }
            return false;
        });



        //Dosya Silme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.delete",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var file_path = file.attr("data-path");
                if (fcfinder.find("form#delete_file_form").size()>0){fcfinder.find("form#delete_file_form").remove();}
                fcfinder.append('<form id="delete_file_form"><input name="file_path" value="'+file_path+'" type="hidden" /></form>');
                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                '<div style="display: none;" class="dialog"><h1>'+opts.i18n.dialog.delete_h.format(file.attr("data-name"))+'</h1>' +
                '<p>'+opts.i18n.dialog.delete_content.format(file.attr("data-name"))+'</p>'+
                '<a class="close" href="#">'+opts.i18n.dialog.close+'</a>' +
                '<a class="btn file_delete" href="#">'+opts.i18n.dialog.delete+'</a>' +
                '</div>');
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
            }
            return false;
        });


        //Dosya Silme Onayı
        $body.on("click",fcfinder_selector+" .dialog a.file_delete",function(){
            var file_path = fcfinder.find("form#delete_file_form input[name='file_path']").val();
            var data = "fcfinder[type]=delete&fcfinder[file_path]="+file_path;
            fcfinder.find(".dialog a.close").trigger("click");
            $.ajax({
                url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else {
                        if (data[1]=="0"){
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.delete_error_0,{type:"p",dialog_class:'danger'});
                        }
                        else {
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.delete_error_1.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                    }
                }});
            return false;
        });




        //Ada Göre Dosya Listeleme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.name_sorter",function(){
            if (!$(this).hasClass("passive")){
                var $ul = fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']"),
                    $li = $ul.find("div");
                if (!$(this).hasClass("z_a"))
                {
                    $li.sort(function(a,b){
                        var an = a.getAttribute('data-name'),
                            bn = b.getAttribute('data-name');
                        if(an > bn) { return 1;}
                        if(an < bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("a_z").addClass("z_a");
                }else {
                    $li.sort(function(a,b){
                        var an = a.getAttribute('data-name'),
                            bn = b.getAttribute('data-name');
                        if(an < bn) { return 1;}
                        if(an > bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("z_a").addClass("a_z");
                }
            }
            Cookies.setCookie("FCFINDER_sortable","name",60*60*24*365);
            return false;
        });



        //Boyuta Göre Dosya Listeleme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.size_sorter",function(){
            if (!$(this).hasClass("passive")){
                var $ul = fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']"),
                    $li = $ul.find("div");
                if (!$(this).hasClass("z_a"))
                {
                    $li.sort(function(a,b){
                        var an = fnc.toInt(a.getAttribute('data-size_2')),
                            bn = fnc.toInt(b.getAttribute('data-size_2'));
                        if(an < bn) { return 1;}
                        if(an > bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("a_z").addClass("z_a");
                }else {
                    $li.sort(function(a,b){
                        var an = fnc.toInt(a.getAttribute('data-size_2')),
                            bn = fnc.toInt(b.getAttribute('data-size_2'));
                        if(an > bn) { return 1;}
                        if(an < bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("z_a").addClass("a_z");
                }
            }
            Cookies.setCookie("FCFINDER_sortable","size",60*60*24*365);
            return false;
        });



        //Tarihine Göre Dosya Listeleme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.date_sorter",function(){
            if (!$(this).hasClass("passive")){
                var $ul = fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']"),
                    $li = $ul.find("div");
                if (!$(this).hasClass("z_a"))
                {
                    $li.sort(function(a,b){
                        var an = fnc.toDate(a.getAttribute('data-date')),
                            bn = fnc.toDate(b.getAttribute('data-date'));
                        if(an > bn) { return 1;}
                        if(an < bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("a_z").addClass("z_a");
                }else {
                    $li.sort(function(a,b){
                        var an = fnc.toDate(a.getAttribute('data-date')),
                            bn = fnc.toDate(b.getAttribute('data-date'));
                        if(an < bn) { return 1;}
                        if(an > bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("z_a").addClass("a_z");
                }
            }
            Cookies.setCookie("FCFINDER_sortable","date",60*60*24*365);
            return false;
        });

        //Türüne Göre Dosya Listeleme
        $body.on("click",fcfinder_selector+" .right ul.widget li a.kind_sorter",function(){
            if (!$(this).hasClass("passive")){
                var $ul = fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']"),
                    $li = $ul.find("div");
                if (!$(this).hasClass("z_a"))
                {
                    $li.sort(function(a,b){
                        var an = a.getAttribute('data-kind'),
                            bn = b.getAttribute('data-kind');
                        if(an > bn) { return 1;}
                        if(an < bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("a_z").addClass("z_a");
                }else {
                    $li.sort(function(a,b){
                        var an = a.getAttribute('data-kind'),
                            bn = b.getAttribute('data-kind');
                        if(an < bn) { return 1;}
                        if(an > bn) {return -1;}
                        return 0;
                    });
                    $li.detach().appendTo($ul);
                    $(this).removeClass("z_a").addClass("a_z");
                }
            }
            Cookies.setCookie("FCFINDER_sortable","kind",60*60*24*365);
            return false;
        });




        //Simge Görünümü
        $body.on("click",fcfinder_selector+" .right ul.widget li a.icon_view",function(){
            if (!$(this).hasClass("passive")) {
                fcfinder.find(".right ul.wrapper").removeClass("list_view").addClass("icon_view");
                Cookies.setCookie("FCFINDER_view_type","icon",60*60*24*365);
                $(this).addClass("passive");
                fcfinder.find(".right ul.widget li a.list_view").removeClass("passive");
                fcfinder.find(".right ul.wrapper li div.list_head").remove();
            }
            return false;
        });

        //Liste Görünümü
        $body.on("click",fcfinder_selector+" .right ul.widget li a.list_view",function(){
            if (!$(this).hasClass("passive")) {
                fcfinder.find(".right ul.wrapper li[data-show='true']").prepend('<div class="list_head"><span class="file_name">'+opts.i18n.file_name+'</span><span class="file_size">'+opts.i18n.file_size+'</span><span class="file_date">'+opts.i18n.file_cdate+'</span></div>');
                fcfinder.find(".right ul.wrapper").removeClass("icon_view").addClass("list_view");
                Cookies.setCookie("FCFINDER_view_type","list",60*60*24*365);
                $(this).addClass("passive");
                fcfinder.find(".right ul.widget li a.icon_view").removeClass("passive");
            }
            return false;
        });






        //Ayarlar Menüsü
        $body.on("click",fcfinder_selector+" .right ul.widget li a.settings",function(){
            if (!$(this).hasClass("passive")){
                var list_type = Cookies.getCookie("FCFINDER_view_type");
                var size_show = Cookies.getCookie("FCFINDER_size_show");
                var date_show = Cookies.getCookie("FCFINDER_date_show");

                var dialog_text = '<div class="dialog-scope"></div>' +
                    '<div style="display: none;" class="dialog"><h1>'+opts.i18n.dialog.settings_h+'</h1>' +
                    '<div class="content">';
                dialog_text += '<div><label><input type="radio" name="view" value="icon"';
                dialog_text += list_type == "icon" ? ' checked="checked" ' : '';
                dialog_text += ' /> '+opts.i18n.dialog.settings_icon_view+' </label></div>';
                dialog_text += '<div><label><input type="radio" name="view" value="list"';
                dialog_text += list_type == "list" ? ' checked="checked" ' : ''
                dialog_text += ' /> '+opts.i18n.dialog.settings_list_view+' </label></div>'
                dialog_text += '<div><label><input type="checkbox" name="size_show" value="true"'
                dialog_text += size_show == "true" ? ' checked="checked" ' : ''
                dialog_text +=' /> '+opts.i18n.dialog.settings_show_size+' </label></div>'
                dialog_text +='<div><label><input type="checkbox" name="date_show" value="true"'
                dialog_text += date_show == "true" ? ' checked="checked" ' : ''
                dialog_text +=' /> '+opts.i18n.dialog.settings_show_date+' </label></div>' +
                '</div>' +
                '<a class="close" href="#">'+opts.i18n.dialog.close+'</a>' +
                '</div>';
                $(fcfinder_selector).prepend(dialog_text);
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
            }
            return false;
        });


        //Ayarlar -> Tarih Göster İnputu Seçilirse
        $body.on("change",fcfinder_selector+" .dialog div.content div label input[name='date_show']",function(){
            fcfinder.find(".right ul.widget li a.show_date").trigger('click');
        });

        //Ayarlar -> Boyut Göster İnputu Seçilirse
        $body.on("change",fcfinder_selector+" .dialog div.content div label input[name='size_show']",function(){
            fcfinder.find(".right ul.widget li a.show_size").trigger('click');
        });

        //Ayarlar -> Görünüm Tipi Seçimi (Liste|Simge)
        $body.on("change",fcfinder_selector+" .dialog div.content div label input[name='view']",function(){
            var view_type = $(this).val();
            if (view_type=="icon"){ fcfinder.find(".right ul.widget li a.icon_view").trigger("click"); }
            if (view_type=="list"){ fcfinder.find(".right ul.widget li a.list_view").trigger("click");}
        });




        //Sıralama Menüsü
        $body.on("click",fcfinder_selector+" .right ul.widget li a.sort",function(){
            if (!$(this).hasClass("passive")){
                var sortable_type = Cookies.getCookie("FCFINDER_sortable");
                var dialog_text = '<div class="dialog-scope"></div>' +
                    '<div style="display: none;" class="dialog"><h1>'+opts.i18n.dialog.sorter_h+'</h1>' +
                    '<div class="content">';
                dialog_text += '<div><label><input type="radio" name="sortable" value="name"';
                dialog_text += sortable_type == "name" ? ' checked="checked" ' : '';
                dialog_text += ' /> '+opts.i18n.dialog.sorter_name+' </label></div>';
                dialog_text += '<div><label><input type="radio" name="sortable" value="size"';
                dialog_text += sortable_type == "size" ? ' checked="checked" ' : ''
                dialog_text += ' /> '+opts.i18n.dialog.sorter_size+' </label></div>'
                dialog_text += '<div><label><input type="radio" name="sortable" value="date"'
                dialog_text +=sortable_type == "date" ? ' checked="checked" ' : ''
                dialog_text +=' /> '+opts.i18n.dialog.sorter_date+' </label></div>'
                dialog_text +='<div><label><input type="radio" name="sortable" value="kind"'
                dialog_text +=sortable_type == "kind" ? ' checked="checked" ' : ''
                dialog_text +=' /> '+opts.i18n.dialog.sorter_kind+' </label></div>' +
                '</div>' +
                '<a class="close" href="#">'+opts.i18n.dialog.close+'</a>' +
                '</div>';
                $(fcfinder_selector).prepend(dialog_text);
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
            }
            return false;
        });


        //Sıralama -> Sıralama Yöntemi Seçimi (İsim|Botur|Tarih|Tür)
        $body.on("change",fcfinder_selector+" .dialog div.content div label input[name='sortable']",function(){
            var sort_type = $(this).val();
            Cookies.setCookie("FCFINDER_sortable",sort_type,60*60*24*365);
            fnc.sortable(sort_type);
            return false;
        });



        //Klavye Kontrolleri
        $(document).keyup(function(e) {
            //ESC Press
            if (e.keyCode == 27) {
                if (fcfinder.find(".dialog").size() > 0 || fcfinder.find(".dialog-scope").size() > 0)
                {
                    fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
                }
                fcfinder.find("#ctxMenu").remove();
                fcfinder.find(".right ul.wrapper li[data-show='true'] div[data-new='new_folder']").remove();
                if (fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html()==""){fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html(opts.i18n.empty_dir);}
                var file = fcfinder.find(".right ul.wrapper li[data-show='true'] div[data-rename='true']");
                file.removeAttr("data-rename");
                file.children("span.file_name").html(file.find("form#file_rename input[name='fcfinder[file_name]']").attr("data-value"));
            }
            //F2 Press
            if(e.which == 113) {
                if (fcfinder.find(".right ul.wrapper li div.active")){
                    fcfinder.find(".right ul.widget li a.rename").trigger('click');
                }
                return false;
            }

        });

        //Hedef Dışı Tıklama Kontrolleri
        $("*").click(function(e){

            if (!$(e.target).is(fcfinder_selector+" ul#ctxMenu") && !$(e.target).is(fcfinder_selector+" ul#ctxMenu *") )
            {
                fcfinder.find("#ctxMenu").remove();
            }

            if (!$(e.target).is(fcfinder_selector+" .dialog") && !$(e.target).is(fcfinder_selector+" .dialog *") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.icon_view") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.list_view") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.show_size") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.show_date") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.name_sorter") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.size_sorter") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.date_sorter") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.kind_sorter") &&
                !$(e.target).is(fcfinder_selector+" "))
            {
                if (!fcfinder.find(".dialog").hasClass("noclose")){
                    fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
                }
            }

            if (!$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-new='new_folder']") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-new='new_folder'] *"))
            {
                fcfinder.find(".right ul.wrapper li[data-show='true'] div[data-new='new_folder']").remove();
                if (fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html()==""){fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html(opts.i18n.empty_dir);}
            }


            if (!$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-rename='true']") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-rename='true'] *"))
            {
                var file = fcfinder.find(".right ul.wrapper li[data-show='true'] div[data-rename='true']");
                file.removeAttr("data-rename");
                file.children("span.file_name").html(file.find("form#file_rename input[name='fcfinder[file_name]']").attr("data-value"));
            }

            if (
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.download") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.info") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.preview") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.edit") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.copy") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.cut") &&
                    //!$(e.target).is(fcfinder_selector+" .right ul.widget li a.paste") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.duplicate") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.rename") &&
                !$(e.target).is(fcfinder_selector+" .right ul.widget li a.delete") &&

                !$(e.target).is(fcfinder_selector+" ul#ctxMenu li") &&
                !$(e.target).is(fcfinder_selector+" ul#ctxMenu li *") &&


                !$(e.target).is(fcfinder_selector+" .right ul.wrapper li div") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li div *"))
            {
                fcfinder.find(".right ul.wrapper li div").removeClass("active");
                fcfinder.find(".right ul.widget li a.download , " +
                ".right ul.widget li a.info , " +
                ".right ul.widget li a.preview , " +
                    //".right ul.widget li a.edit , " +
                ".right ul.widget li a.copy , " +
                ".right ul.widget li a.cut , " +
                    //".right ul.widget li a.paste  , " +
                ".right ul.widget li a.duplicate , " +
                ".right ul.widget li a.rename , " +
                ".right ul.widget li a.delete").addClass("passive");

            }

        });


        //Sağ Tıklama Ayarı
        $("*").contextmenu(function(e){
            fcfinder.find("#ctxMenu").remove();
            if (!$(e.target).is(fcfinder_selector+" .right ul.wrapper li div.list_head") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li div.list_head *")){
                if ($(e.target).is(fcfinder_selector+" .right ul.wrapper li div") || $(e.target).is(fcfinder_selector+" .right ul.wrapper li div *")) {
                    if (typeof $(e.target).parent("div").attr("data-name") === "undefined") {
                        var file = $(e.target);
                    }else {
                        var file = $(e.target).parent("div");
                    }
                    file.trigger("click");
                    fcfinder.prepend('<ul id="ctxMenu"></ul>');
                    var ctxMenu = fcfinder.find("#ctxMenu");
                    var x = parseInt(e.pageX) - 20;
                    var y = parseInt(e.pageY) - 30;
                    var d_x = $(document).width();
                    var d_y = $(document).height();
                    var ctxW_x = ctxMenu.width();
                    var ctxH_y = ctxMenu.height();

                    if (x >= d_x - ctxW_x - 50) { x = d_x - ctxW_x - 50; }
                    if (y >= d_y - ctxH_y - 40) { y = d_y - ctxH_y - 40;}

                    //
                    ctxMenu.html('<li><a class="none">' + file.attr("data-name") + '</a></li><li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:open">'+opts.i18n.contextmenu.file_open+'</a></li>'+
                    '<li><a href="fcfinder:preview">'+opts.i18n.contextmenu.file_preview+'</a></li>'+
                    '<li><a href="fcfinder:download">'+opts.i18n.contextmenu.file_download+'</a></li>'+
                    '<li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:copy">'+opts.i18n.contextmenu.file_copy+'</a></li>'+
                    '<li><a href="fcfinder:cut">'+opts.i18n.contextmenu.file_cut+'</a></li>'+
                    '<li><a href="fcfinder:duplicate">'+opts.i18n.contextmenu.file_duplicate+'</a></li>'+
                    '<li><a href="fcfinder:rename">'+opts.i18n.contextmenu.file_rename+'</a></li>'+
                    '<li><a href="fcfinder:delete">'+opts.i18n.contextmenu.file_delete+'</a></li>'+
                    '<li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:info">'+opts.i18n.contextmenu.file_info+'</a></li>');

                    ctxMenu.css({"left": x + "px", "top": y + "px"});
                }

                if ($(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true']") || $(e.target).is(fcfinder_selector+" .right ul.wrapper")) {

                    fcfinder.prepend('<ul id="ctxMenu"></ul>');
                    var ctxMenu = fcfinder.find("#ctxMenu");
                    var x = parseInt(e.pageX) - 20;
                    var y = parseInt(e.pageY) - 30;
                    var d_x = $(document).width();
                    var d_y = $(document).height();
                    var ctxW_x = ctxMenu.width();
                    var ctxH_y = ctxMenu.height();

                    if (x >= d_x - ctxW_x - 50) { x = d_x - ctxW_x - 50; }
                    if (y >= d_y - ctxH_y - 40) { y = d_y - ctxH_y - 40;}


                    var paste;
                    if (fcfinder.find(".right ul.widget li a.paste").hasClass("passive")){
                        paste = '<li><a class="none" href="fcfinder:paste">'+opts.i18n.contextmenu.wrapper_paste+'</a></li>';
                    }else{paste = '<li><a href="fcfinder:paste">'+opts.i18n.contextmenu.wrapper_paste+'</a></li>';}

                    var view;
                    if (Cookies.getCookie("FCFINDER_view_type")=="icon"){
                        view = '<li><a href="fcfinder:list_view">'+opts.i18n.contextmenu.wrapper_list_view+'</a></li>';
                    }else{
                        view = '<li><a href="fcfinder:icon_view">'+opts.i18n.contextmenu.wrapper_icon_view+'</a></li>';
                    }

                    ctxMenu.html('<li><a class="none">' + fcfinder.find(".right ul.wrapper li[data-show='true']").attr("data-path") + '</a></li><li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:upload">'+opts.i18n.contextmenu.wrapper_upload+'</a></li>'+
                    '<li><a href="fcfinder:newfolder">'+opts.i18n.contextmenu.wrapper_newfolder+'</a></li>'+
                    '<li><a href="fcfinder:refresh">'+opts.i18n.contextmenu.wrapper_refresh+'</a></li>'+
                    paste+
                    '<li class="hr">&nbsp;</li>'+
                    view+
                    '<li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:showsize">'+opts.i18n.contextmenu.wrapper_show_size+'</a></li>'+
                    '<li><a href="fcfinder:showdate">'+opts.i18n.contextmenu.wrapper_show_size+'</a></li>'+
                    '<li class="hr">&nbsp;</li>'+
                    '<li><a href="fcfinder:namesorter">'+opts.i18n.contextmenu.wrapper_namesorter+'</a></li>'+
                    '<li><a href="fcfinder:sizesorter">'+opts.i18n.contextmenu.wrapper_sizesorter+'</a></li>'+
                    '<li><a href="fcfinder:datesorter">'+opts.i18n.contextmenu.wrapper_datesorter+'</a></li>'+
                    '<li><a href="fcfinder:kindsorter">'+opts.i18n.contextmenu.wrapper_kindsorter+'</a></li>');


                    ctxMenu.css({"left": x + "px", "top": y + "px"});
                }
            }
            return false;
        });



        //Sağ Tıklama Menü Link Seçimi
        $body.on("click",fcfinder_selector+" ul#ctxMenu li a",function(){
            if ($(this).attr("class")=="none"){ return false; }else {
                fcfinder.find("ul#ctxMenu").remove();
                if ($(this).attr("href")=="fcfinder:open"){ fcfinder.find(".right ul.wrapper li div.active").trigger("dblclick");}
                if ($(this).attr("href")=="fcfinder:preview"){ fcfinder.find(".right ul.widget li a.preview").trigger("click"); }
                if ($(this).attr("href")=="fcfinder:download"){fcfinder.find(".right ul.widget li a.download").trigger("click");}
                if ($(this).attr("href")=="fcfinder:copy"){fcfinder.find(".right ul.widget li a.copy").trigger("click");}
                if ($(this).attr("href")=="fcfinder:cut"){fcfinder.find(".right ul.widget li a.cut").trigger("click");}
                if ($(this).attr("href")=="fcfinder:duplicate"){fcfinder.find(".right ul.widget li a.duplicate").trigger("click");}
                if ($(this).attr("href")=="fcfinder:rename"){fcfinder.find(".right ul.widget li a.rename").trigger("click");}
                if ($(this).attr("href")=="fcfinder:delete"){fcfinder.find(".right ul.widget li a.delete").trigger("click");}
                if ($(this).attr("href")=="fcfinder:info"){fcfinder.find(".right ul.widget li a.info").trigger("click");}

                if ($(this).attr("href")=="fcfinder:upload"){ fcfinder.find(".right ul.widget li a.upload input.upload_field").trigger("click");}
                if ($(this).attr("href")=="fcfinder:newfolder"){ fcfinder.find(".right ul.widget li a.new_folder").trigger("click");}
                if ($(this).attr("href")=="fcfinder:refresh"){ fcfinder.find(".right ul.widget li a.refresh").trigger("click");}
                if ($(this).attr("href")=="fcfinder:paste"){ fcfinder.find(".right ul.widget li a.paste").trigger("click");}
                if ($(this).attr("href")=="fcfinder:list_view"){ fcfinder.find(".right ul.widget li a.list_view").trigger("click");}
                if ($(this).attr("href")=="fcfinder:icon_view"){ fcfinder.find(".right ul.widget li a.icon_view").trigger("click");}

                if ($(this).attr("href")=="fcfinder:showdate"){ fcfinder.find(".right ul.widget li a.show_date").trigger("click");}
                if ($(this).attr("href")=="fcfinder:showsize"){ fcfinder.find(".right ul.widget li a.show_size").trigger("click");}

                if ($(this).attr("href")=="fcfinder:namesorter"){ fcfinder.find(".right ul.widget li a.name_sorter").trigger("click");}
                if ($(this).attr("href")=="fcfinder:sizesorter"){ fcfinder.find(".right ul.widget li a.size_sorter").trigger("click");}
                if ($(this).attr("href")=="fcfinder:datesorter"){ fcfinder.find(".right ul.widget li a.date_sorter").trigger("click");}
                if ($(this).attr("href")=="fcfinder:kindsorter"){ fcfinder.find(".right ul.widget li a.kind_sorter").trigger("click");}


                return false;
            }

        });



        //Yeni Klasör Form Submit
        $body.on("submit",fcfinder_selector+" #new_directory",function(){
            var data = $(this).serialize();
            $.ajax({
                url: opts.url, dataType: 'json', type: 'POST', data: data, success: function (data) {

                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        fcfinder.find(".left #all_folders ul.folders li a[href='"+data[1].top_dir+"']").trigger("click");
                        fcfinder.find(".left #all_folders ul.folders li a[href='"+data[1].top_dir+"']").children("span.braca").addClass("closed");
                    }else {
                        if (data[1]=="-1"){
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.new_directory_error_1,{type:"p",dialog_class:'danger'});
                        }
                        else {
                            fnc.prepend_dialog(opts.i18n.faild_process,opts.i18n.error.new_directory_error_0.format(data[2]),{type:"p",dialog_class:'danger'});
                        }
                    }
                }
            });
            return false;
        });

        //Dialog Kapatma Butonu
        $body.on("click",fcfinder_selector+" .dialog a.close",function(){
            fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
            fnc.fcfinderresize();
            return false;
        });




        //Hakkında Sayfası
        $body.on("click",fcfinder_selector+" .right ul.widget li a.about",function(){
            return false;
        });




        //Görüntü Yükseklik Genişlik Ayarları
        fnc.fcfinderresize();
        $(window).resize(function(){ fnc.fcfinderresize(); fcfinder.find(".dialog").ortala(); });

        //Tıklama Efekti Ayarı
        fnc.ripleClick(fcfinder_selector+" .right ul.widget li a ,"+fcfinder_selector+" .right ul.wrapper li div ,"+fcfinder_selector+" .left #all_folders ul.folders li a span.folder");






        //String Objesi Metod Ekleme
        String.prototype.format = function() {
            var formatted = this;
            for (var i = 0; i < arguments.length; i++) {
                var regexp = new RegExp('\\{'+i+'\\}', 'gi');
                formatted = formatted.replace(regexp, arguments[i]);
            }
            return formatted;
        };

        //$ Genişletme Yeni Metod Ekleme
        $().__proto__.ortala = function(){
            this.css({
                left: ($(window).width()/2)-(this.width()/2),
                top: ($(window).height()/2)-(this.height()/2)
            });

        };

    };

})(jQuery);
