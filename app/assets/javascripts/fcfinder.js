;(function($){
    $.fn.fcFinder = function(ayarlar) {
        var fcfinder = $(this);
        var fcfinder_selector = fcfinder.selector;

        var empty_dir = "Dizin Boş";

        Cookies = {
            setCookie : function (cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            },
            getCookie : function (cname) {
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



        // Cookies Settings
        Cookies.getCookie("FCFINDER_size_show")==""?Cookies.setCookie("FCFINDER_size_show","false",60*60*24*365):'';
        Cookies.getCookie("FCFINDER_date_show")==""?Cookies.setCookie("FCFINDER_date_show","false",60*60*24*365):'';








        fcfinder.append("" +
            "<div class=\"left\"><div id=\"all_folders\">" +
            "<ul class=\"folders\">" +
                "<li><a><span class=\"folder\">Loading...<span class=\"load\"></span></span>" +
                "</a></li>"+
            //    "<li><a href=\"#\" class='active'>" +
            //    "<span class=\"braca closed\"></span>" +
            //    "<span class=\"folder\">home</span>"+
            //    "</a></li>"+
            //"<li><a href=\"#\">" +
            //    "<span class=\"braca closed\"></span>" +
            //    "<span class=\"folder\">home</span>"+
            //    "</a></li>"+
            "</div></div>" +
            "<div class=\"right\">" +
                "<ul class=\"widget\">" +
                    "<li><a title=\"Yükle\" class=\"upload\"><form style=\"opacity:0;\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">" +
                    "<input class=\"upload_field\" name=\"upload[]\" onchange=\"this.form.submit()\" style=\"height:31px\" multiple=\"multiple\" type=\"file\">"+
                    "<input name=\"type\" value=\"upload_file\" type=\"hidden\">"+
                    "</form></a></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Yeni Klasör\" class=\"new_folder\">Yeni Klasör</a></li>"+
        "<li><a href=\"fcfinder:refresh\" title=\"Yenile\" class=\"refresh\">Yenile</a></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"İndir\" class=\"download passive\">İndir</a></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Bilgiler\" class=\"info passive\">Bilgiler</a><div>" +
        "<ul>" +
        "<li><a href=\"fcfinder:settings\" title=\"Önizle\" class=\"preview passive\">Önizle</a></li>" +
        "</ul>" +
        "</div></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Düzenle\" class=\"edit passive\">Düzenle</a><div>" +
        "<ul>" +
        "<li><a href=\"fcfinder:settings\" title=\"Kopyala\" class=\"copy passive\">Kopyala</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Kes\" class=\"cut passive\">Kes</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Yapıştır\" class=\"paste passive\">Yapıştır</a></li>" +

        "<li><a href=\"fcfinder:settings\" title=\"Kopyasını Oluştur\" class=\"duplicate passive\">Kopyasını Oluştur</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Yeniden Adlandır\" class=\"rename passive\">Yeniden Adlandır</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Düzenle\" class=\"edit passive\">Düzenle</a></li>" +
        "</ul>" +
        "</div></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Sil\" class=\"delete passive\">Sil</a></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Ayarlar\" class=\"settings\">Ayarlar</a><div>" +
        "<ul>" +
        "<li><a href=\"fcfinder:settings\" title=\"Simge Görünümü\" class=\"icon_view passive\">Simge Görünümü</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Liste Görünümü\" class=\"list_view\">Liste Görünümü</a></li>" +


        "<li><a data-show=\""+Cookies.getCookie("FCFINDER_size_show")+"\" href=\"fcfinder:showsize\" title=\"Boyutu Göster\" class=\"show_size\">Boyutu Göster</a></li>"+
        "<li><a data-show=\""+Cookies.getCookie("FCFINDER_date_show")+"\" href=\"fcfinder:showdate\" title=\"Oluşturma Tarihini Göster\" class=\"show_date\">Oluşturulma Tarihini Göster</a></li>"+
        "</ul>" +
        "</div></li>"+

        "<li><a href=\"fcfinder:settings\" title=\"Sırala\" class=\"sort\">Sırala</a><div>" +
        "<ul>" +

        "<li><a href=\"fcfinder:settings\" title=\"Ada Göre Sırala\" class=\"name_sorter\">Ada Göre Sırala</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Boyuta Göre Sırala\" class=\"size_sorter\">Boyuta Göre Sırala</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Tarihe Göre Sırala\" class=\"date_sorter\">Tarihe Göre Sırala</a></li>" +
        "<li><a href=\"fcfinder:settings\" title=\"Türüne Göre Sırala\" class=\"kind_sorter\">Türüne Göre Sırala</a></li>" +


        "</ul>" +
        "</div></li>"+





        "<li><a href=\"fcfinder:settings\" title=\"Hakkında\" class=\"about\">Hakkında</a></li>"+


                "</ul>"+
                "<ul class=\"wrapper icon_view\">" +
                        "<li>Loading...<span class=\"load\"></span></li>"+
                "</ul>"+
            "</div>" +
            "<div class=\"clear\"></div>" +
            "<div class=\"bottom\">%s Files (%s MB)</div>");



        is_show_size = Cookies.getCookie("FCFINDER_size_show")=="true"?" style=\"display:block;\"":"";
        is_show_date = Cookies.getCookie("FCFINDER_date_show")=="true"?" style=\"display:block;\"":"";


        fcfinderresize();
        $(window).resize(function(){ fcfinderresize(); });

        var ul_folders = fcfinder.children(".left").children("#all_folders").children("ul.folders");
        var ul_wrapper = fcfinder.children(".right").children("ul.wrapper");



        $.ajax({url:ayarlar.url,dataType:'json',type:'POST',success:function(data) {
            console.log(data);
            if (data == "Access not allowed!") {
                alert("Erişim İzniniz Yok!");
                // Erişim izni YOK!
            }
            else{
                main_file_path = data.main_file.path;

                var main_class = data.main_file.sub_dir ? " opened " : " ";
                ul_folders.html("").append("<li><a id=\"true\" href=\"fcdir:/\" class='active'>" +
                "<span class=\"braca"+main_class+
                "\"></span>" +
                "<span class=\"folder\">"+main_file_path+"</span>"+
                "</a></li>");

                if($.isEmptyObject(data.directory) &&  $.isEmptyObject(data.file))
                {
                    ul_wrapper.html("").append("<li>Dosya Boş</li>");
                }else
                {
                    ul_wrapper.html("").append("<li class=\"file_wrapper\" data-show=\"true\" data-path=\"fcdir:/\"></li>");
                }




                ul_folders.children("li").append("<ul class=\"folders\"></ul>");


                $.each(data.directory,function(key,val){
                    ul_wrapper.find(".file_wrapper:first").append("<div data-path=\""+val.path+"\" data-name=\""+key+"\" data-size=\""+val.size+"\" data-date=\""+val.ctime+"\" data-kind=\""+val.type+"\"  class=\"directory\"><span class=\"file_name\">"+key+"</span><span class=\"file_size\""+is_show_size+">"+val.size+"</span><span class=\"file_date\""+is_show_date+">"+val.ctime+"</span></div>");


                    var ths_cls = val.sub_dir? " closed " : "";
                    ul_folders.children("li").children("ul.folders").append("<li><a href=\""+val.path+"\">" +
                    "<span class=\"braca "+ths_cls+"\"></span>" +
                    "<span class=\"folder\">"+key+"</span>"+
                    "</a></li>");
                });

                appendFiles(data);
            }


        }});




        $("body").on("click",fcfinder_selector+" ul.folders a",function(e){
            var ths = $(this);
            var url = ths.attr("href");
            var id = ths.attr("id");
            var data_path = ths.attr("href");



            fcfinder.find(".right ul.wrapper li.file_wrapper").attr("data-show","false").hide();
            fcfinder.find(".right ul.wrapper li.file_wrapper[data-path='" + data_path + "']").attr("data-show","true").show();
            fcfinder.find("ul.folders li a").removeClass("active");
            ths.addClass("active").attr("data-show","true");


            if (id!="true" && id!="false"){

                if (ths.children("span.braca").hasClass("closed")){
                    ths.children("span.braca").removeClass("closed").addClass("opened");
                }


                ths.parent("li").append("<span class=\"folder_load\">Load Directory..</span>");

                var data = 'fcfinder[url]='+url+'&fcfinder[type]=all_file_list';
                $.ajax({url:ayarlar.url,dataType:'json',type:'POST',data:data,success:function(data) {
                    console.log(data);
                    if (!$.isEmptyObject(data.directory))
                    {
                        ths.parent("li").append("<ul class=\"folders\"></ul>");
                        $.each(data.directory,function(key,val){
                            var ths_cls = val.sub_dir? " closed " : "";
                            ths.parent("li").children("ul.folders").append("<li><a href=\""+val.path+"\">" +
                            "<span class=\"braca "+ths_cls+"\"></span>" +
                            "<span class=\"folder\">"+key+"</span>"+
                            "</a></li>");
                        });
                    }

                    //#TODO: oluşma tarihi gibi bilgileri çek küçükten büyüğe doğru sırala sıralamaları yap

                    if ($.isEmptyObject(data.directory) && $.isEmptyObject(data.file))
                    {
                        fcfinder.find(".right ul.wrapper li.file_wrapper").hide();
                        if (ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").size()=="0"){
                            ul_wrapper.append("<li class=\"file_wrapper\" data-show=\"true\" data-path=\""+data_path+"\">"+empty_dir+"</li>").show();
                        }else{
                            ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").show();
                        }
                        ths.removeAttr("id").removeAttr("data-show");
                    }else {
                        fcfinder.find(".right ul.wrapper li.file_wrapper").hide();
                        if (ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").size()=="0"){
                            ul_wrapper.append("<li class=\"file_wrapper\" data-show=\"true\" data-path=\""+data_path+"\"></li>").show();
                        }else{
                            ul_wrapper.find("li.file_wrapper[data-path='"+data_path+"']").show();
                        }

                        if (ul_wrapper.find(".file_wrapper:last").html()!=""){ul_wrapper.find(".file_wrapper:last").html("");}
                        $.each(data.directory,function(key,val){
                            ul_wrapper.find(".file_wrapper:last").append("<div data-path=\""+val.path+"\" data-name=\""+key+"\" data-size=\""+val.size+"\" data-kind=\""+val.type+"\" data-date=\""+val.ctime+"\" class=\"directory\"><span class=\"file_name\">"+key+"</span><span class=\"file_size\""+is_show_size+">"+val.size+"</span><span class=\"file_date\""+is_show_date+">"+val.ctime+"</span></div>");
                        });

                        appendFiles(data);

                    }

                   ths.next("span.folder_load").remove();

                }});
                ths.attr("id","true");
            }

            return false;
        });


        $("body").on("click",fcfinder_selector+" .right ul.wrapper li div",function(){
            var ths = $(this);
            fcfinder.find(".right ul.wrapper li div").removeClass("active");
            ths.addClass("active");
            if (fcfinder.find(".right ul.wrapper li div.active").attr("data-new")!="new_folder")
            {
                fcfinder.find(".right ul.widget li a.download , " +
                ".right ul.widget li a.info , " +
                ".right ul.widget li a.preview , " +
                ".right ul.widget li a.edit , " +
                ".right ul.widget li a.copy , " +
                ".right ul.widget li a.cut , " +
                //".right ul.widget li a.paste  , " +
                ".right ul.widget li a.duplicate , " +
                ".right ul.widget li a.rename , " +
                ".right ul.widget li a.delete").removeClass("passive");
            }
        });

        $("body").on("click",fcfinder_selector+' .left #all_folders ul.folders li a span.braca',function(){

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




        });

        $("body").on("click",fcfinder_selector+" .right ul.widget li a.show_size",function(){
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
            return false;
        });

        $("body").on("click",fcfinder_selector+" .right ul.widget li a.show_date",function(){
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
            return false;
        });

        $("body").on("click",fcfinder_selector+" .right ul.widget li a.new_folder",function(){
            var dir = fcfinder.find(".right ul.wrapper li[data-show='true']");
            if (dir.html()==empty_dir){dir.html("");}
            fcfinder.find(".right ul.wrapper li div").removeClass("active");
            dir.prepend('<div data-new="new_folder" data-path="" data-name="" data-size="0" data-date="" data-kind="directory" class="active directory"><span class="file_name"><form id="new_directory"><input type="text" name="fcfinder[directory_name]" /><input type="hidden" name="fcfinder[type]" value="create_directory"/> <input type="hidden" name="fcfinder[path]" value="'+dir.attr("data-path")+'"></form></span><span class="file_size"></span><span class="file_date"></span></div>');
            dir.find("input").select();

            return false;
        });

        $("body").on("click",fcfinder_selector+" .right ul.widget li a.refresh",function(){
            //#TODO Bulunan Dizin listesi ve görüntüleri yenilenecek içleri html kısımları tekrardan append edilecek;
            var left_wrapper = fcfinder.find(".left #all_folders ul li a.active");
            var right_wrapper =  fcfinder.find(".right  ul.wrapper li.file_wrapper[data-show='true']");
            if (right_wrapper.attr("data-path") == left_wrapper.attr("href")){
                var path = right_wrapper.attr("data-path");
                var data = "fcfinder[type]=refresh&fcfinder[path]="+path;
                left_wrapper.next("ul").html("")
                right_wrapper.html("")
                $.ajax({url:ayarlar.url,dataType:'json',type:'POST',data:data,success:function(data) {
                    console.log(data);
                    if ($.isEmptyObject(data.directory) && $.isEmptyObject(data.file))
                    {
                        right_wrapper.html(empty_dir);
                    }else {
                        if (right_wrapper.html()!=""){right_wrapper.html("");}
                        $.each(data.directory,function(key,val){
                            var ths_cls = val.sub_dir? " closed " : "";
                            left_wrapper.next("ul.folders").append("<li><a href=\""+val.path+"\">" +
                            "<span class=\"braca "+ths_cls+"\"></span>" +
                            "<span class=\"folder\">"+key+"</span>"+
                            "</a></li>");

                            right_wrapper.append("<div data-path=\""+val.path+"\" data-kind=\""+val.type+"\" data-name=\""+key+"\" data-size=\""+val.size+"\" data-date=\""+val.ctime+"\" class=\"directory\"><span class=\"file_name\">"+key+"</span><span class=\"file_size\""+is_show_size+">"+val.size+"</span><span class=\"file_date\""+is_show_date+">"+val.ctime+"</span></div>");
                        });

                        appendFiles(data,right_wrapper);

                    }
                }});
            }else {
                alert("Bir Hata Meydana Geldi");
            }

            return false;
        });


        //download_file
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.download",function(){
            //#TODO:download işlemini yaptırt
            if (!$(this).hasClass("passive")){
                var data = "fcfinder[type]=download&fcfinder[path]="+fcfinder.find(".right ul.wrapper li div.active").attr("data-path");
                $.ajax({
                    url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                        alert(data);
                        console.log(data);
                    }});
                    }
            return false;
        });


        $().__proto__.ortala = function(){
            this.css({
                left: ($(window).width()/2)-(this.width()/2),
                top: ($(window).height()/2)-(this.height()/2)
            });

        };

        function ortala($this){
            $this.css({
                left: "50%",
                top: "40%",
                "margin-left":-(this.width()/2)+"px",
                "margin-top":-(this.height()/2)+"px"
            });
        }

        //info
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.info",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var kind = file.attr("data-kind");
                var data = "fcfinder[type]=info&fcfinder[file]="+file.attr("data-path")+"&kind="+kind;
                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                '<div style="display: none;" class="dialog"><h1>Bilgiler</h1>' +
                '<p>Yükleniyor...<span class="load"></span> </p>' +
                '</div>');
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
                $.ajax({
                    url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                        console.log(data);
                        var permissions,_class = "";
                        if (data.permissions.read == "true"){ permissions = "Okuma İzni"; }
                        if (data.permissions.write == "true"){ permissions = "Yazma İzni"; }
                        if (data.permissions.write == "true" && data.permissions.read == "true"){ permissions = "Yazma ve Okuma İzni"; }
                        if (data.mime_type == "directory") { data.mime_type = "Klasör"; var _class = " directory"; }
                        $(fcfinder_selector).find(".dialog").html('<h1>Bilgiler</h1>' +
                        '<div class="file_bg'+_class+'" style="'+file.attr("style")+'"></div>'+
                        '<span class="file_name">'+file.attr("data-name")+'</span><span class="file_type">'+data.mime_type+'</span>'+
                        '<ul class="file_info">' +
                        '<li><span>Boyutu:</span>'+data.size+'</li>' +
                        '<li><span>Adresi:</span>'+data.path+'</li>' +
                        '<li><span>Link:</span><a target="_blank" href="//'+data.url+'">'+file.attr("data-name")+'</a></li>' +
                        '<li><span>Oluşturulma Tarihi</span>'+data.ctime+'</li>' +
                        '<li><span>Son Değişiklik Tarihi</span>'+data.mtime+'</li>' +
                        '<li><span>Dosya İzinleri</span>'+permissions+'</li>' +
                        '</ul>' +
                        '<a href="#" class="close">Kapat</a>');
                        fcfinder.find(".dialog").ortala();
                    }});
            }
            return false;
        });



        //preview
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.preview",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var kind = file.attr("data-kind");
                var data = "fcfinder[type]=preview&fcfinder[file]="+file.attr("data-path")+"&kind="+kind;
                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                '<div style="display: none;" class="dialog"><h1>Önizle</h1>' +
                '<p>Yükleniyor...<span class="load"></span> </p>' +
                '</div>');
                fcfinder.find(".dialog").fadeIn(300);
                $.ajax({
                    url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                        console.log(data);
                        var _class = "";
                        if (data.mime_type == "directory") { data.mime_type = "Klasör"; var _class = " directory"; }

                        if (kind == "image_file"){
                            fcfinder.find(".dialog").css({"width":"80%"});
                            $(fcfinder_selector).find(".dialog").html('<h1>'+file.attr("data-name")+'</h1>' +
                            '<img style="width:'+$(window).width()/4+'px;" class="preview" src="//'+data.url+'" />' +
                            '<div class="clear"></div>'+
                            '<a href="#" class="close">Kapat</a>' +
                            '<div class="clear"></div>');
                            fcfinder.find(".dialog").ortala();
                        }
                        else{
                            $(fcfinder_selector).find(".dialog").html('<h1>Önizle</h1>' +
                            '<div class="file_bg'+_class+'" style="'+file.attr("style")+'"></div>'+
                            '<span class="file_name">'+file.attr("data-name")+'</span><span class="file_type">'+data.mime_type+'</span>'+
                            '<ul class="file_info">' +
                            '<li><span>Boyutu:</span>'+data.size+'</li>' +
                            '<li><span>Adresi:</span>'+data.path+'</li>' +
                            '<li><span>Link:</span><a target="_blank" href="//'+data.url+'">'+file.attr("data-name")+'</a></li>' +
                            '<li><span>Oluşturulma Tarihi</span>'+data.ctime+'</li>' +
                            '<li><span>Son Değişiklik Tarihi</span>'+data.mtime+'</li>' +
                            '</ul>' +
                            '<a href="#" class="close">Kapat</a>');

                            fcfinder.find(".dialog").ortala();
                        }



                    }});
            }
            return false;
        });

        //copy
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.copy",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var copy_file_path = file.attr("data-path");
                if (fcfinder.find("#copy_form").size()>0){ fcfinder.find("#copy_form").remove(); }
                fcfinder.append('<form id="copy_form"><input type="hidden" name="copy_file_path" value="'+copy_file_path+'" /><input type="hidden" name="copy_type" value="copy" /></form>');
                fcfinder.find(".right ul.widget li a.paste").removeClass("passive");
            }
            return false;
        });


        //cut
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.cut",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                cut_file = file;
                var copy_file_path = file.attr("data-path");
                if (fcfinder.find("#copy_form").size()>0){ fcfinder.find("#copy_form").remove(); }
                fcfinder.append('<form id="copy_form"><input type="hidden" name="copy_file_path" value="'+copy_file_path+'" /><input type="hidden" name="copy_type" value="cut" /></form>');
                fcfinder.find(".right ul.widget li a.paste").removeClass("passive");
            }
            return false;
        });

        //paste
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.paste",function(){
            var $ths = $(this);
            if (!$ths.hasClass("passive")){
                var $input = fcfinder.find("input[name='copy_file_path']");
                var $type = fcfinder.find("input[name='copy_type']").val();
                var copy_file_path = $input.val();
                var this_folder_path = fcfinder.find(".left #all_folders ul.folders li a.active").attr("href");
                var data = "";
                if ($type=="copy"){ data = "fcfinder[type]=copy&fcfinder[copy_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;}
                if ($type=="cut") { data = "fcfinder[type]=cut&fcfinder[cut_file_path]="+copy_file_path+"&fcfinder[this_folder_path]="+this_folder_path;}
                $.ajax({
                    url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data){
                        console.log(data);
                        if (data[0]=="true")
                        {
                            if (cut_file){cut_file.remove();}
                            fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        }else {
                            if (data[1] == "0"){
                                alert("Kopyalamaya Çalıştığınız Dizinde Aynı İsimde Dosya Bulunmaktadır Kopyalama İşlemi Durduruldu");
                            }
                            else{
                                alert("Bir Hata Meydana Geldi ve Koyalama İşlemi Gerçekleştirilemedi");
                            }
                        }
                    }});
                $input.remove();
                $ths.addClass("passive");

            }
            return false;
        });

        //duplicate
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.duplicate",function(){
            if (!$(this).hasClass("passive")){
                var file_path = fcfinder.find(".right ul.wrapper li div.active").attr("data-path");
                var data = "fcfinder[type]=duplicate&fcfinder[file_path]="+file_path;
                $.ajax({
                    url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data){
                        console.log(data);
                        if (data[0]=="true")
                        {
                            fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                        }else
                        {
                            //Kopyası Oluşmadı
                            alert("Bir Hata Meydana Geldi ve Seçtiğiniz Dosyanın Kopyası Oluşturulamadı");
                        }
                    }});

            }
            return false;
        });


        //rename
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.rename",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                file.children("span.file_name").html('<form id="file_rename"><input type="text" name="fcfinder[file_name]" value="'+file.children("span.file_name").html()+'" /><input type="hidden" name="fcfinder[type]" value="file_rename"/> <input type="hidden" name="fcfinder[path]" value="'+file.attr("data-path")+'"></form>');
                //#TODO:select uzantı ayarını yap!
                file.find("span.file_name form input[name='fcfinder[file_name]']").select();
            }
            return false;
        });


        //file_rename form submit
        $("body").on("submit",fcfinder_selector+" #file_rename",function(){
            var data = $(this).serialize();
            $.ajax({
                url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else {
                        //Bir hata meydana geldi adı değiştirilemedi
                        alert("Bir Hata Meydana Geldi Dosya Adı Değiştirilemedi");
                    }
                }});
            return false;
        });


        //edit
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.edit",function(){
            if (!$(this).hasClass("passive")){
                //#TODO:Geliştirme Yapılacak
                window.open("http://apps.pixlr.com/editor/");
            }
            return false;
        });

        //delete
        $("body").on("click",fcfinder_selector+" .right ul.widget li a.delete",function(){
            if (!$(this).hasClass("passive")){
                var file = fcfinder.find(".right ul.wrapper li div.active");
                var file_path = file.attr("data-path");
                if (fcfinder.find("form#delete_file_form").size()>0){fcfinder.find("form#delete_file_form").remove();}
                fcfinder.append('<form id="delete_file_form"><input name="file_path" value="'+file_path+'" type="hidden" /></form>');

                $(fcfinder_selector).prepend('<div class="dialog-scope"></div>' +
                '<div style="display: none;" class="dialog"><h1>'+file.attr("data-name")+' Sil</h1>' +
                '<p>'+file.attr("data-name")+' Kalıcı Olarak Silmek İstediğinize Eminmisiniz?</p>' +
                '<a class="close" href="#">Kapat</a>' +
                '<a class="btn file_delete" href="#">Sil</a>' +
                '</div>');
                fcfinder.find(".dialog").fadeIn(300);
                fcfinder.find(".dialog").ortala();
            }
            return false;
        });

        $("body").on("click",fcfinder_selector+" .dialog a.file_delete",function(){
            var file_path = fcfinder.find("form#delete_file_form input[name='file_path']").val();
            var data = "fcfinder[type]=delete&fcfinder[file_path]="+file_path;
            fcfinder.find(".dialog a.close").trigger("click");
            $.ajax({
                url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                    if (data[0]=="true"){
                        fcfinder.find(".right ul.widget li a.refresh").trigger("click");
                    }else {
                        //Dosya Yok
                        alert("Silmeye Çalıştığınız Dosyaya Erişilemiyor.");
                    }
                }});
            return false;
        });








        //ESC key press controll
        $(document).keyup(function(e) {

            if (e.keyCode == 27) {
                if (fcfinder.find(".dialog").size() > 0 || fcfinder.find(".dialog-scope").size() > 0)
                {
                    fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
                }
            }
        });

        // Hedef dışı tıklama
        $("*").click(function(e){

            if (!$(e.target).is(fcfinder_selector+" .dialog") && !$(e.target).is(fcfinder_selector+" .dialog *"))
            {
                fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
            }

            if (!$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-new='new_folder']") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li[data-show='true'] div[data-new='new_folder'] *"))
            {
                fcfinder.find(".right ul.wrapper li[data-show='true'] div[data-new='new_folder']").remove();
                if (fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html()==""){fcfinder.find(".right ul.wrapper li.file_wrapper[data-show='true']").html(empty_dir);}
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


                !$(e.target).is(fcfinder_selector+" .right ul.wrapper li div") && !$(e.target).is(fcfinder_selector+" .right ul.wrapper li div *"))
            {
                fcfinder.find(".right ul.wrapper li div").removeClass("active");
                fcfinder.find(".right ul.widget li a.download , " +
                ".right ul.widget li a.info , " +
                ".right ul.widget li a.preview , " +
                ".right ul.widget li a.edit , " +
                ".right ul.widget li a.copy , " +
                ".right ul.widget li a.cut , " +
                //".right ul.widget li a.paste  , " +
                ".right ul.widget li a.duplicate , " +
                ".right ul.widget li a.rename , " +
                ".right ul.widget li a.delete").addClass("passive");

            }

        });

        //right click false
        $("*").contextmenu(function(){
            //#TODO:Right click düzenle
            return false;
        });


        $("body").on("submit",fcfinder_selector+" #new_directory",function(){
            var data = $(this).serialize();
            var directory_div = $(this).parents("div.directory[data-new='new_folder']");
            $.ajax({
                url: ayarlar.url, dataType: 'json', type: 'POST', data: data, success: function (data) {
                    console.log(data);
                    if (data[0]=="true"){
                        directory_div.removeAttr("data-new").attr("data-path",data[1].path).attr("data-name",data[1].name).attr("data-size",data[1].size).attr("data-date",data[1].ctime);
                        directory_div.children("span.file_name").html(data[1].name);
                        directory_div.children("span.file_size").html(data[1].size);
                        directory_div.children("span.file_date").html(data[1].ctime);
                        fcfinder.find(".left #all_folders ul.folders li a.active").next("ul.folders")
                            .append('<li><a href="'+data[1].path+'"><span class="braca"></span><span class="folder">'+data[1].name+'</span></a></li>');
                        fcfinder.find(".left #all_folders ul.folders li a[href='"+data[1].top_dir+"']").children("span.braca").addClass("closed");
                    }else {
                        if (data[1]=="-1"){alert("Bu İsimde Dosya Var");}
                        else {alert("Bir Hata Meydana Geldi ve Klasör Oluşturulamadı");}
                    }
                }
            });
            return false;
        });

        $("body").on("click",fcfinder_selector+" .dialog a.close",function(){
            fcfinder.find(".dialog").fadeOut(300, function(){ fcfinder.find(".dialog-scope , .dialog").remove(); });
            return false;
        });

        function appendFiles(data,type){
            type = type || "";
            if (type==""){
                var element =ul_wrapper.find(".file_wrapper:last");
            }
            else{var element =type;}

            $.each(data.file,function(key,val){
                var _style_type = "";
                if (val.type == "image_file") { _style_type = "style=\"background:url('//"+val.url.replace("uploads","uploads/.thumbs")+"') no-repeat center 5px / 65% 60px \"";  }
                element.append("<div "+_style_type+" data-kind=\""+val.type+"\" data-date=\""+val.ctime+"\" data-size=\""+val.size+"\" data-name=\""+key+"\" data-path=\""+val.path+"\" class=\""+val.type+"\"><span class=\"file_name\">"+key+"</span><span class=\"file_size\""+is_show_size+">"+val.size+"</span><span class=\"file_date\""+is_show_date+">"+val.ctime+"</span></div>");
            });


            if (is_show_date == " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+32+10);}
            if (is_show_size == " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+16+10);}
            if (is_show_date == " style=\"display:block;\"" && is_show_size ==  " style=\"display:block;\"" ){fcfinder.find(".right ul.wrapper li div").height(80+16+32+10);}

        }


        function fcfinderresize()
        {
            fcfinder.children(".right").width(fcfinder.width()-fcfinder.children(".left").width()-15);
            fcfinder.children(".right .wrapper , .right .widget").width(fcfinder.children(".right").width()-10);
            fcfinder.children(".right").children(".wrapper").height(($("body").height()-fcfinder.find(".widget").height())-43);
            fcfinder.children(".left").height($("body").height()-35);

        }

        function ripleClick(_class)
        {
            var ink, d, x, y;
            $("body").on("click",_class,function(e){

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
                //setTimeout(function(){ ink.remove();},600);
            });
        }



        ripleClick(fcfinder_selector+" .right ul.widget li a");
        ripleClick(fcfinder_selector+" .right ul.wrapper li div");
        ripleClick(fcfinder_selector+" .left #all_folders ul.folders li a span.folder");







    };
})(jQuery);

