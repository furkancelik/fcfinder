require 'fileutils'
require "fcfinder/version"
require "fcfinder/engine"


module Fcfinder
  class Connector
    attr_reader :run
    def initialize(file,host_url,fc_params=nil)
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
          when "all_file_list"
            url_params = get_path(fc_params[:url])
            @url_params = append_file(url_params+"/*")
            @run = @url_params.to_json
          when "create_directory"
            create_file_path = File.join(get_path(fc_params[:path]),fc_params[:directory_name])
            unless File.exist?(create_file_path)
              if Dir.mkdir(create_file_path)
                @run = ["true",{:top_dir => fc_params[:path], :name => fc_params[:directory_name], :url => set_path(create_file_path), :sub_dir => false, :size => format_mb(directory_size(create_file_path)), :ctime => File.ctime(create_file_path).strftime("%d/%m/%Y %H:%M"), :path => set_path(create_file_path) }].to_json
              else
                #0 => Herhangibir Hata var Dosya Oluşmadı
                @run = ["false","0"].to_json
              end
            else
              #-1 => Aynı İsimde Dosya Var Dosya Oluşmadı
              @run = ["false","-1"].to_json
            end
          when "refresh"
            refresh_path = get_path(fc_params[:path])
            file_list = append_file(refresh_path+"/*")
            @run = file_list.to_json
          when "download"
            #TODO:dosya indirmesini düzenles
            #@run = { :path =>get_path(fc_params[:path]), :type => MIME::Types.type_for(get_path(fc_params[:path])).first.content_type }.to_json
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
            p reg_file
            p reg_file[1]+"."
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
            p get_path(fc_params[:path])
            p File.exist?(get_path(fc_params[:path]))
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
          all_dir[file.split("/").last] = {:file=>file, :path => set_path(file),:url => get_url(set_path(file)), :sub_dir => false, :size => format_mb(directory_size(file)), :ctime => File.ctime(file).strftime("%d/%m/%Y %H:%M"), :path => set_path(file), :type => "directory" }
          Dir.glob(file+"/*").each do |sub_dir|
            if File.directory?(sub_dir)
              all_dir[file.split("/").last][:sub_dir] = true
            end
          end
        else
          all_file[file.split("/").last] = {:file=>file, :path => set_path(file), :url => get_url(set_path(file)), :type => set_type(MIME::Types.type_for(file).first.content_type), :size => format_mb(File.size(file)), :ctime => File.ctime(file).strftime("%d/%m/%Y %H:%M")}
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
      case type
        when "image/png","image/jpeg"
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
      return "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}"
    end


  end
end

