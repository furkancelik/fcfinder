require 'fileutils'
require 'mini_magick'
require 'zip'
require "fcfinder/version"
require "fcfinder/engine"
require 'fcfinder/zip_file_generator'


module Fcfinder
  class Connector
    attr_reader :run
    def initialize(file,host_url,fc_params=nil,options = {})

      #1MB
      max_file_size = options[:max_file_size] ||= 1_000_000
      options[:allowed_mime] ||= {}
      options[:disallowed_mime] ||= {}
      #izin verilen dosyalar
      permission_mime = permission_mime(options[:allowed_mime],options[:disallowed_mime])

      @fcdir = file.chomp("/*")
      @main_folder = @fcdir.split("/").last
      @host_url = host_url
      @main_file = {}

      p "----------------------------"
      p "file->",file
      p "host_url->",host_url
      p "fc_params->",fc_params
      p "----------------------------"

      unless fc_params.nil?
        case fc_params[:type]

          #Tum Dosyaları Listele
          #Klasor Secilme İslemi Yapilinca
          when "all_file_list"
            url_params = get_path(fc_params[:url])
            @url_params = append_file(url_params+"/*")
            @run = @url_params.to_json

          #Yeni Klasor Olusturma
          when "create_directory"
            create_file_path = File.join(get_path(fc_params[:path]),fc_params[:directory_name])
            unless File.exist?(create_file_path)
              if Dir.mkdir(create_file_path)
                @run = ["true"].to_json
              else
                #0 => Herhangibir Hata var Dosya Oluşmadı
                @run = ["false","0"].to_json
              end
            else
              #-1 => Aynı İsimde Dosya Var Dosya Oluşmadı
              @run = ["false","-1"].to_json
            end

          #Yenileme Islemi
          when "refresh"
            refresh_path = get_path(fc_params[:path])
            file_list = append_file(refresh_path+"/*")
            @run = file_list.to_json

          #Dosya Indirme Islemi
          when "download"
            begin
              if (File.directory?(get_path(fc_params[:path])))
                directoryToZip = get_path(fc_params[:path])
                outputFile = get_path(fc_params[:path]).chomp("/")+".zip"
                zf = ZipFileGenerator.new(directoryToZip, outputFile)
                zf.write()
                file = set_path(outputFile).sub("fcdir:/","")
                type = get_path(fc_params[:path].chomp("/")+".zip").chomp("/")
              else
                file = fc_params[:path].sub("fcdir:/","")
                type = get_path(fc_params[:path])
              end
              @run = { :file =>file, :type => MIME::Types.type_for(type).first.content_type }.to_json
            rescue Exception => e
              @run = ["false","0",e.to_s]
            end
            @run

          when "info"
            @run = { :url => get_url(fc_params[:file]),
                     :path => fc_params[:file],
                     :size => fc_params[:kind]=="directory" ? format_mb(directory_size(get_path(fc_params[:file]))) : format_mb(File.size(get_path(fc_params[:file]))),
                     :ctime => File.ctime(get_path(fc_params[:file])).strftime("%d/%m/%Y %H:%M"),
                     :mtime => File.mtime(get_path(fc_params[:file])).strftime("%d/%m/%Y %H:%M"),
                     :type => File.directory?(get_path(fc_params[:file])) ? "directory" : set_type(MIME::Types.type_for(get_path(fc_params[:file])).first.content_type) ,
                     :mime_type => File.directory?(get_path(fc_params[:file])) ? "directory" : MIME::Types.type_for(get_path(fc_params[:file])).first.content_type ,
                     :permissions => {:write => File.writable?(get_path(fc_params[:file])).to_s, :read => File.readable?(get_path(fc_params[:file])).to_s}
            }.to_json
          when "preview"
            @run = { :url => get_url(fc_params[:file]),
                     :path => fc_params[:file],
                     :size => fc_params[:kind]=="directory" ? format_mb(directory_size(get_path(fc_params[:file]))) : format_mb(File.size(get_path(fc_params[:file]))),
                     :ctime => File.ctime(get_path(fc_params[:file])).strftime("%d/%m/%Y %H:%M"),
                     :mtime => File.mtime(get_path(fc_params[:file])).strftime("%d/%m/%Y %H:%M"),
                     :type => File.directory?(get_path(fc_params[:file])) ? "directory" : set_type(MIME::Types.type_for(get_path(fc_params[:file])).first.content_type) ,
                     :mime_type => File.directory?(get_path(fc_params[:file])) ? "directory" : MIME::Types.type_for(get_path(fc_params[:file])).first.content_type ,
                     :permissions => {:write => File.writable?(get_path(fc_params[:file])).to_s, :read => File.readable?(get_path(fc_params[:file])).to_s}
            }.to_json

          when "copy"
            file_path = get_path(fc_params[:this_folder_path]).chomp("/")+"/"+get_path(fc_params[:copy_file_path]).split("/").last
            if (File.exist?(file_path) || File.directory?(file_path))
              @run = ["false","0"].to_json
              #0 => Aynı Dosyadan Var
            else
              #Kopyalama İşlemini Gerçekleştir
              #TODO:buraya bi if getir kopyalma gerçekleştimi bak
              FileUtils.cp_r(get_path(fc_params[:copy_file_path]),get_path(fc_params[:this_folder_path]))
              @run = ["true"].to_json
            end

          when "cut"
            file_path = get_path(fc_params[:this_folder_path]).chomp("/")+"/"+get_path(fc_params[:cut_file_path]).split("/").last
            if (File.exist?(file_path) || File.directory?(file_path))
              @run = ["false","0"].to_json
              #0 => Aynı Dosyadan Var
            else
              #Kesme İşlemini Gerçekleştir
              #TODO:buraya bi if getir kesme gerçekleştimi bak
              FileUtils.mv(get_path(fc_params[:cut_file_path]),get_path(fc_params[:this_folder_path]))
              @run = ["true"].to_json
            end

          when "duplicate"

            file_path = get_path(fc_params[:file_path]).chomp("/")
            extension = (file_path.split("/").last.split(".").size>1) ? "."+file_path.split("/").last.split(".").last : ""
            file_name = file_path.split("/").last.chomp(extension)
            folder_name = file_path.chomp(file_path.split("/").last).chomp("/")

            reg_file = "#{file_name}".match(/(.+?) copy ([0-9])/i);
            unless (reg_file.nil?)
              #"file_name copy 1" şeklinde bir dosya adı var
              j = Dir.glob("#{folder_name}/#{reg_file[1]} copy *#{extension}").last.match(/#{reg_file[1]} copy ([0-9])#{extension}/)[1].to_i + 1
              new_file_name = "#{reg_file[1]} copy #{j}#{extension}"
              new_file_path = folder_name.chomp("/")+"/"+new_file_name
              #TODO:fosya kopyalamaya if koy
              FileUtils.cp_r(file_path,new_file_path)
              @run = ["true"].to_json
            else
              FileUtils.cp_r(file_path,folder_name+"/"+file_name+" copy 1"+extension)
              @run = ["true"].to_json
            end
          when "file_rename"
            if (File.exist?(get_path(fc_params[:path])))
              folder_name = get_path(fc_params[:path]).chomp(get_path(fc_params[:path]).split("/").last).chomp("/")
              #TODO:if koy!
              FileUtils.mv(get_path(fc_params[:path]),folder_name+"/"+fc_params[:file_name])
              @run = ["true"].to_json
            else
              #return false Dosya Yok!
              @run = ["false"].to_json
            end
          when "delete"
            if (File.exist?(get_path(fc_params[:file_path])))
              #TODO:if koy!
              FileUtils.rm_rf(get_path(fc_params[:file_path]))
              @run = ["true"].to_json
            else
              #return false Dosya Yok!
              @run = ["false"].to_json
            end

          when "upload"
            begin
                image_mime_type = %w(image/x-ms-bmp image/jpeg image/gif image/png)
                file_path = []
                error_delete_file = []
                fc_params[:upload].each do |file|

                  #dosya büyük
                  return @run = ["false","0",format_mb(max_file_size)].to_json if file.tempfile.size > max_file_size
                  #format yok
                  return @run = ["false","-1",permission_mime.to_a].to_json  unless permission_mime.has_key?(file.original_filename.split(".").last) || permission_mime[file.original_filename.split(".").last]==file.content_type

                  file_path.push(File.join(get_path(fc_params[:path]),file.original_filename)) if image_mime_type.include?(file.content_type)
                  error_delete_file.push(File.join(get_path(fc_params[:path]),file.original_filename))
                  File.open(File.join(get_path(fc_params[:path]),file.original_filename), "wb")  do |f|
                    f.write(file.read)
                  end

                end

                # resimleri yeniden boyutlandır
                file_path.each{ |file|
                  thumbs = file.sub(@fcdir.chomp("/"),@fcdir.chomp("/")+"/.thumbs").chomp(file.sub(@fcdir.chomp("/"),@fcdir.chomp("/")+"/.thumbs").split("/").last).chomp("/")
                  unless (File.exist?(thumbs))
                    _file = ""
                    thumbs.split("/").each { |file|
                      _file << file+"/"
                      p _file
                      unless (File.exist?(_file))
                        Dir.mkdir(_file.chomp("/"))
                      end
                    }
                  end

                  image = MiniMagick::Image.open(file)
                  image.resize "64x64"
                  image.write(file.sub(@fcdir.chomp("/"),@fcdir.chomp("/")+"/.thumbs"))
                }

                @run = ["true"].to_json
            rescue Exception => e
              error_delete_file.each{ |file|
                FileUtils.rm_rf(file) unless File.size(file) > 0
              }
              @run = ["false","-2",e.to_s].to_json
            end
            @run


          else
            ###
        end
      else
        @main_params = append_file(file)
        @main_params[:main_file] = { :path => file.split("/")[-2], :url => file, :sub_dir => @main_file[:sub_dir] }
        @run = @main_params.to_json
      end

    end

    def append_file(files_url)
      all_file,all_dir = {},{}
      Dir.glob(files_url).each do |file|
        if File.directory?(file)
          @main_file[:sub_dir] = true if @main_file[:sub_dir].nil?
          all_dir[file.split("/").last] = {:file=>file, :path => set_path(file),:url => get_url(set_path(file)), :sub_dir => false, :size_2 => directory_size(file), :size => format_mb(directory_size(file)), :ctime => File.ctime(file).strftime("%d/%m/%Y %H:%M"), :path => set_path(file), :type => "_directory" }
          Dir.glob(file+"/*").each do |sub_dir|
            if File.directory?(sub_dir)
              all_dir[file.split("/").last][:sub_dir] = true
            end
          end
        else
          all_file[file.split("/").last] = {:file=>file, :path => set_path(file), :url => get_url(set_path(file)), :type => set_type(MIME::Types.type_for(file).first.content_type), :size_2 => File.size(file), :size => format_mb(File.size(file)), :ctime => File.ctime(file).strftime("%d/%m/%Y %H:%M")}
        end
      end
      { :directory => all_dir, :file => all_file }
    end


    def set_path(path)
      path.chomp("/").sub(@fcdir,"fcdir:")
    end

    def get_path(path)
      path.chomp("/").sub("fcdir:",@fcdir)
    end

    def set_url(path)
      path.chomp("/").sub(File.join(@host_url,@main_folder)+@main_folder,"fcdir:")
    end

    def get_url(path)
      path.chomp("/").sub("fcdir:",File.join(@host_url,@main_folder))
    end

    def set_type(type)
      p type
      case type

        when "application/vnd.ms-word"
          "doc"
        when "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          "docx"
        when "application/vnd.ms-excel"
          "xls"
        when "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          "xlsx"
        when "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          "pptx"
        when "application/vnd.ms-powerpoint"
          "ppt"
        when "application/pdf"
          "pdf"
        when "application/xml"
          "xml"
        when "application/x-shockwave-flash"
          "swf"
        when "application/x-gzip","application/gzip"
          "gz"
        when "application/x-gtar"
          "tgz"
        when "application/x-bzip"
          "bz"
        when "application/x-bzip2"
          "bz2"
        when "application/zip"
          "zip"
        when "application/x-rar","application/x-rar-compressed"
          "rar"
        when "application/x-tar"
          "tar"
        when "application/x-7z-compressed"
          "7z"
        when "text/plain"
          "txt"
        when "text/x-php","application/x-httpd-php"
          "php"
        when "text/html"
          "html"
        when "text/htm"
          "htm"
        when "application/javascript"
          "js"
        when "text/css"
          "css"
        when "application/x-ruby"
          "rb"

        when "image/tiff"
          "tiff"
        when "image/x-targa"
          "tga"
        when "image/vnd.adobe.photoshop"
          "psd"
        when "image/x-icon"
          "ico"

        when "audio/mpeg"
          "mp3"
        when "audio/midi"
          "mid"
        when "audio/ogg"
          "ogg"
        when "audio/mp4"
          "mp4a"
        when "audio/wav","audio/x-wav"
          "wav"
        when "audio/x-ms-wma"
          "vma"

        when "video/x-msvideo"
          "avi"
        when "video/x-dv"
          "dv"
        when "video/mp4"
          "mp4"
        when "video/mpeg"
          "mpeg"
        when "video/mpeg"
          "mpg"
        when "video/quicktime"
          "mov"
        when "video/x-ms-wmv"
          "vm"
        when "video/x-flv"
          "flv"
        when "video/x-matroska"
          "mkv"

        when "image/png","image/jpeg",'image/x-ms-bmp','image/gif'
          "image_file"

        else
          "other"
      end
    end

    def directory_size(path)
      path << '/' unless path.end_with?('/')
      raise RuntimeError, "#{path} is not a directory" unless File.directory?(path)
      total_size = 0
      Dir["#{path}**/*"].each do |f|
        total_size += File.size(f) if File.file?(f) && File.size?(f)
      end
      total_size
    end





    def format_mb(size)
      conv = [ 'B', 'KB', 'MB', 'GB', 'TER', 'PB', 'EB' ];
      scale = 1024;

      ndx=1
      if( size < 2*(scale**ndx)  ) then
        return "#{(size)} #{conv[ndx-1]}"
      end
      size=size.to_f
      [2,3,4,5,6,7].each do |ndx|
        if( size < 2*(scale**ndx)  ) then
          return "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}"
        end
      end
      ndx=7
      "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}"
    end

    def permission_mime(allowed_mime,disallowed_mime)
      permission = {
          'doc'   => 'application/vnd.ms-word',
          'docx'  => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls'   => 'application/vnd.ms-excel',
          'xlsx'  => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'ppt'   => 'application/vnd.ms-powerpoint',
          'pps'   => 'application/vnd.ms-powerpoint',
          'pptx'  => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'pdf'   => 'application/pdf',
          'xml'   => 'application/xml',
          'swf'   => 'application/x-shockwave-flash',
          # archives
          'gz'    => 'application/x-gzip',
          'tgz'   => 'application/x-gzip',
          'bz'    => 'application/x-bzip2',
          'bz2'   => 'application/x-bzip2',
          'tbz'   => 'application/x-bzip2',
          'zip'   => 'application/zip',
          'rar'   => 'application/x-rar',
          'tar'   => 'application/x-tar',
          'rar'   => 'application/x-rar-compressed',
          '7z'    => 'application/x-7z-compressed',
          # texts
          'txt'   => 'text/plain',
          'php'   => 'text/x-php',
          'html'  => 'text/html',
          'htm'   => 'text/html',
          'js'    => 'text/javascript',
          'css'   => 'text/css',
          'rtf'   => 'text/rtf',
          'rtfd'  => 'text/rtfd',
          'py'    => 'text/x-python',
          'java'  => 'text/x-java-source',
          'rb'    => 'text/x-ruby',
          'erb'   => 'text/x-ruby',
          'sh'    => 'text/x-shellscript',
          'pl'    => 'text/x-perl',
          'sql'   => 'text/x-sql',
          # images
          'bmp'   => 'image/x-ms-bmp',
          'jpg'   => 'image/jpeg',
          'jpeg'  => 'image/jpeg',
          'gif'   => 'image/gif',
          'png'   => 'image/png',
          'tif'   => 'image/tiff',
          'tiff'  => 'image/tiff',
          'tga'   => 'image/x-targa',
          'psd'   => 'image/vnd.adobe.photoshop',
          'ico'   =>  'image/x-icon',
          # audio
          'mp3'   => 'audio/mpeg',
          'mid'   => 'audio/midi',
          'ogg'   => 'audio/ogg',
          'mp4a'  => 'audio/mp4',
          'wav'   => 'audio/wav',
          'wma'   => 'audio/x-ms-wma',
          # video
          'avi'   => 'video/x-msvideo',
          'dv'    => 'video/x-dv',
          'mp4'   => 'video/mp4',
          'mpeg'  => 'video/mpeg',
          'mpg'   => 'video/mpeg',
          'mov'   => 'video/quicktime',
          'wm'    => 'video/x-ms-wmv',
          'flv'   => 'video/x-flv',
          'mkv'   => 'video/x-matroska'
      }
      permission.merge!(allowed_mime)
      permission.delete_if {|key| disallowed_mime.include?(key) }
      permission
    end


  end
end

