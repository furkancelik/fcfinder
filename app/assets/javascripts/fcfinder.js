;(function($){
    $.fn.fcFinder = function(ayarlar) {
        var fcfinder = $(this);
        var fcfinder_selector = fcfinder.selector;

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
                    "<li><a href=\"fcfinder:refresh\" title=\"Yenile\" class=\"refresh\">Yenile</a></li>"+
                    "<li><a href=\"fcfinder:settings\" title=\"Ayarlar\" class=\"settings\">Ayarlar</a></li>"+
                "</ul>"+
                "<div class=\"wrapper\"></div>"+
            "</div>" +
            "<div class=\"clear\"></div>" +
            "<div class=\"bottom\">%s Files (%s MB)</div>");


        fcfinderresize();
        $(window).resize(function(){ fcfinderresize(); });

        var ul_folders = fcfinder.children(".left").children("#all_folders").children("ul.folders");


        $.ajax({url:ayarlar.url,dataType:'json',type:'POST',success:function(data) {
            var main_class = data.main_file.sub_dir ? " opened " : " ";

            ul_folders.html("").append("<li><a id=\"true\" href=\"fcdir:/\" class='active'>" +
            "<span class=\"braca"+main_class+
            "\"></span>" +
            "<span class=\"folder\">"+data.main_file.path+"</span>"+
            "</a></li>");



            ul_folders.children("li").append("<ul class=\"folders\"></ul>");
            $.each(data.directory,function(key,val){
                var ths_cls = val.sub_dir? " closed " : "";
                ul_folders.children("li").children("ul.folders").append("<li><a href=\""+val.url+"\">" +
                "<span class=\"braca "+ths_cls+"\"></span>" +
                "<span class=\"folder\">"+key+"</span>"+
                "</a></li>");
            });
        }});


        $("body").on("click",fcfinder_selector+" ul.folders a",function(){
            var ths = $(this);
            var url = ths.attr("href");
            var id = ths.attr("id");

            if (id=="true"){
                _trigger();
                ths.next("ul.folders").hide();
                ths.attr("id","false");
            }
            else if(id=="false"){
                _trigger();
                ths.next("ul.folders").show();
                ths.attr("id","true");
            }
            else{
                _trigger();

                ths.parent("li").append("<span class=\"folder_load\">Load Directory..</span>");
                $.ajax({url:ayarlar.url,dataType:'json',type:'POST',data:"url="+url,success:function(data) {
                    if (!jQuery.isEmptyObject(data.directory))
                    {
                        ths.parent("li").append("<ul class=\"folders\"></ul>");
                        $.each(data.directory,function(key,val){
                            var ths_cls = val.sub_dir? " closed " : "";
                            ths.parent("li").children("ul.folders").append("<li><a href=\""+val.url+"\">" +
                            "<span class=\"braca "+ths_cls+"\"></span>" +
                            "<span class=\"folder\">"+key+"</span>"+
                            "</a></li>");
                        });
                    }
                   ths.next("span.folder_load").remove();

                }});
                ths.attr("id","true");
            }

            function _trigger(){
                fcfinder.find("ul.folders li a").removeClass("active");
                ths.addClass("active");
                if (ths.children("span.braca").hasClass("closed"))
                {
                    ths.children("span.braca").removeClass("closed").addClass("opened")
                    ths.attr("id","true");
                }
                else if(!ths.children("span.braca").hasClass("closed") && ths.children("span.braca").hasClass("opened")) {
                    ths.children("span.braca").removeClass("opened").addClass("closed")
                    ths.attr("id","false");
                }
            }
            return false;
        });




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
                //return false;
            });
        }


        ripleClick(fcfinder_selector+" .left #all_folders ul.folders li a span.folder");
        ripleClick(fcfinder_selector+" .right ul.widget li a");

    };
})(jQuery);