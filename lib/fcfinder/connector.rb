module Fcfinder
  class Connector
    attr_reader :run

    def initialize(file,host_url,fc_params=nil,options = {})

      #Max dosya boyutu boş ise 1MB dosya yüklemesine izin ver
      @max_file_size = options[:max_file_size] ||= 1_000_000
      @allowed_mime = options[:allowed_mime] ||= {}
      @disallowed_mime = options[:disallowed_mime] ||= {}
      #izin verilen dosyalar
      @permission_mime = permission_mime(@allowed_mime,@disallowed_mime)

      @file = file
      @fcdir = file.chomp('/*')
      @main_folder = @fcdir.split('/').last
      @host_url = host_url
      @main_file = {}


      if fc_params.nil?
        @main_params = append_file(file)
        @main_params[:main_file] = {:path => file.split('/')[-2], :url => file, :sub_dir => @main_file[:sub_dir]}
        result = [@main_params, @main_params[:directory].size+@main_params[:file].size, format_mb(directory_size(@main_params[:main_file][:url].chomp('/*')))]
      else
        result = case fc_params[:type]
                   when 'path_to_url'
                     path_to_url(get_path(fc_params[:path]))

                   #Tum Dosyaları Listele
                   #Klasor Secilme İslemi Yapilinca
                   when 'all_file_list'
                     all_file_list(get_path(fc_params[:url]))

                   #Yeni Klasor Olusturma
                   when 'create_directory'
                     create_directory(fc_params[:path], fc_params[:directory_name])

                   #Yenileme Islemi
                   when 'refresh'
                     refresh(get_path(fc_params[:path]))

                   #Dosya Indirme Islemi
                   when 'download'
                     download(get_path(fc_params[:path]))

                   #Bilgiler
                   when 'info'
                     info_and_preview(fc_params[:file], fc_params[:kind])

                   #Onizleme
                   when 'preview'
                     info_and_preview(fc_params[:file], fc_params[:kind])

                   #Dosya Kopyala
                   when 'copy'
                     copy(get_path(fc_params[:copy_file_path]), get_path(fc_params[:this_folder_path]))

                   #Dosya Zorunlu Kopyala
                   when 'copy!'
                     copy!(get_path(fc_params[:copy_file_path]), get_path(fc_params[:this_folder_path]))

                   #Dosya Kesme
                   when 'cut'
                     cut(get_path(fc_params[:cut_file_path]), get_path(fc_params[:this_folder_path]))

                   #Dosyayı Zorla Kes
                   when 'cut!'
                     cut!(get_path(fc_params[:cut_file_path]), get_path(fc_params[:this_folder_path]))

                   #Dosya Kopyasını Oluşturma
                   when 'duplicate'
                     duplicate(get_path(fc_params[:file_path]))

                   #Dosya Yeniden Adlandır
                   when 'file_rename'
                     file_rename(get_path(fc_params[:path]), fc_params[:file_name])

                   #Dosya Silme İşlemi
                   when 'delete'
                     delete!(get_path(fc_params[:file_path]))

                   #Dosya Yükleme İşlemi
                   when 'upload'
                     upload(fc_params[:upload], get_path(fc_params[:path]))

                   #Dosya Duzenleme
                   when 'edit_file'
                     edit_file(get_path(fc_params[:file_path]))
                   else
                     # type code here
                 end
      end
      @run = result.to_json
    end


    def path_to_url(path)
      if File.exist?(path)
        ['true',get_url(set_path(path))]
      else
        %w(false 0)
      end
    end


    def all_file_list(url)
      @url_params = append_file(url+'/*')
      [@url_params,@url_params[:directory].size+@url_params[:file].size,format_mb(directory_size(url))]
    end

    def create_directory(path,directory_name)
      create_file_path = File.join(get_path(path),directory_name)
      create_file_thumbs = create_file_path.sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs')
      if File.exist?(create_file_path)
        #-1 => Aynı İsimde Dosya Var Dosya Oluşmadı
        %w(false -1)
      else
        if Dir.mkdir(create_file_path) && Dir.mkdir(create_file_thumbs)
          ['true', {:top_dir => path, :path => set_path(create_file_path)}]
        else
          #0 => Herhangibir Hata var Dosya Oluşmadı
          %w(false 0)
        end
      end
    end

    def refresh(path)
      append_file(File.join(path,'/*'))
    end

    def add_zip_file(path, output_file)
      zf = ZipFileGenerator.new(path, output_file)
      zf.write
    end

    def download(path)
      begin
        if File.directory?(path)
          output_file = path.chomp('/')+'.zip'
          add_zip_file(path, output_file)
          file = set_path(output_file).sub('fcdir:/', '').split('/').join(':')
          type = path.chomp('/')+'.zip'
        else
          file = set_path(path).sub('fcdir:/', '').split('/').join(':')
          type = path
        end
        result = { :file => file, :type => MIME::Types.type_for(type).first.content_type }
      rescue Exception => e
        result = ['false', '0',e.to_s]
      end
      result
    end

    def info_and_preview(file,kind)
      { :url => get_url(file),
        :path => file,
        :size => kind=='directory' ? format_mb(directory_size(get_path(file))) : format_mb(File.size(get_path(file))),
        :ctime => File.ctime(get_path(file)).strftime('%d/%m/%Y %H:%M'),
        :mtime => File.mtime(get_path(file)).strftime('%d/%m/%Y %H:%M'),
        :type => File.directory?(get_path(file)) ? 'directory' : set_type(MIME::Types.type_for(get_path(file)).first.content_type) ,
        :mime_type => File.directory?(get_path(file)) ? 'directory' : MIME::Types.type_for(get_path(file)).first.content_type ,
        :permissions => {:write => File.writable?(get_path(file)).to_s, :read => File.readable?(get_path(file)).to_s}
      }
    end

    def thumbs(opt)
      thumbs = ''
      thumbs = opt[:target].sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs') if opt[:type] == :cut || opt[:type] == :copy || opt[:type] == :rename
      thumbs = opt[:file_path].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs') if opt[:type] == :duplicate || opt[:type] == :duplicate2
      if File.directory?(opt[:file])
        FileUtils.cp_r(opt[:file].sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs'),thumbs) if opt[:type ] == :copy
        FileUtils.mv(opt[:file].sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs'),thumbs) if opt[:type ] == :cut
        FileUtils.cp_r(thumbs, opt[:folder_name].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs')+'/'+opt[:file_name]+' copy 1'+opt[:extension]) if opt[:type ] == :duplicate
        FileUtils.cp_r(thumbs, opt[:new_file_path].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs')) if opt[:type2] == :duplicate2
        FileUtils.mv(thumbs, File.join(opt[:folder_name].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs'),opt[:file_name])) if opt[:type] == :rename
      else
        if %w(image/x-ms-bmp image/jpeg image/gif image/png).include?(MIME::Types.type_for(opt[:file]).first.content_type)
          unless File.exist?(thumbs)
            _folder = ''
            thumbs.split('/').each do |folder|
              _folder << folder+'/'
              unless File.exist?(_folder)
                Dir.mkdir(_folder.chomp('/'))
              end
            end
          end
          FileUtils.cp_r(opt[:file].sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs'),thumbs) if opt[:type] == :copy
          FileUtils.mv(opt[:file].sub(@fcdir.chomp('/'),@fcdir.chomp('/')+'/.thumbs'),thumbs) if opt[:type] == :cut
          FileUtils.cp_r(thumbs, opt[:folder_name].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs')+'/'+opt[:file_name]+' copy 1'+opt[:extension]) if opt[:type] == :duplicate
          FileUtils.cp_r(thumbs, opt[:new_file_path].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs')) if opt[:type] == :duplicate2
          FileUtils.mv(thumbs, File.join(opt[:folder_name].sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs'),opt[:file_name])) if opt[:type] == :rename
        end
      end
    end

    def image_resize(file_path)
      file_path.each do |file|
        #ORJ=>thumbs = file.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs').chomp(file.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs').split('/').last).chomp('/')
        thumbs = file.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs').chomp(file.split('/').last).chomp('/')
        unless File.exist?(thumbs)
          _folder = ''
          thumbs.split('/').each do |folder|
            _folder << folder + '/'
            unless File.exist?(_folder)
              Dir.mkdir(_folder.chomp('/'))
            end
          end
        end
        image = MiniMagick::Image.open(file)
        image.resize '64x64'
        image.write(file.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs'))
      end
    end

    def copy(file,target)
      begin
        file_path = File.join(target,file.split('/').last)
        if File.exist?(file_path)
          #0 => Aynı Dosyadan Var
          result = %w(false 0)
        else
          #Kopyalama İşlemini Gerçekleştir
          FileUtils.cp_r(file,target)
          thumbs({:file=>file, :target=>target, :type=>:copy})
          result = %w(true)
        end
      rescue Exception => e
        result =  ['false', '-1',e.to_s]
      end
      result
    end

    def copy!(file,target)
      begin
        #Kopyalama İşlemini Gerçekleştir
        FileUtils.cp_r(file,target)

        #thumbs'a kopyasını gönder
        thumbs({:file=>file, :target=>target, :type=>:copy})
        result = %w(true)
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def cut(file,target)
      begin
        file_path = target.chomp('/')+'/'+file.split('/').last
        if File.exist?(file_path) || File.directory?(file_path)
          #0 => Aynı Dosyadan Var
          result = %w(false 0)
        else
          #Kesme İşlemini Gerçekleştir
          FileUtils.mv(file,target)
          #thumbs'a kopyasını gönder
          thumbs({:file=>file, :target=>target, :type=>:cut})
          result = %w(true)
        end
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def cut!(file,target)
      begin
        #Kesme İşlemini Gerçekleştir
        FileUtils.mv(file,target)
        #thumbs'a kopyasını gönder
        thumbs({:file=>file, :target=>target, :type=>:cut})
        result = %w(true)
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def duplicate(file)
      begin
        file_path = file.chomp('/')
        extension = (file_path.split('/').last.split('.').size>1) ? '.'+file_path.split('/').last.split('.').last : ''
        file_name = file_path.split('/').last.chomp(extension)
        folder_name = file_path.chomp(file_path.split('/').last).chomp('/')

        reg_file = "#{file_name}".match(/(.+?) copy ([0-9])/i)
        if reg_file.nil? && !File.exist?(folder_name+'/'+file_name+' copy 1'+extension)
          FileUtils.cp_r(file_path, folder_name+'/'+file_name+' copy 1'+extension)
          #thumbs dosyaları ekle
          thumbs({:file_path=>file_path,:file=>file_path,:type=>:duplicate,:folder_name=>folder_name,:file_name=>file_name,:extension=>extension})
          result = %w(true)
        else
          #"file_name copy 1" şeklinde bir dosya adı var
          reg_file = "#{file_name} copy 1#{extension}".match(/(.+?) copy ([0-9])/i) if reg_file.nil?
          j = Dir.glob("#{folder_name}/#{reg_file[1]} copy *#{extension}").last.match(/#{reg_file[1]} copy ([0-9])#{extension}/)[1].to_i + 1

          new_file_name = "#{reg_file[1]} copy #{j}#{extension}"
          new_file_path = folder_name.chomp('/')+'/'+new_file_name
          FileUtils.cp_r(file_path, new_file_path)
          #thumbs'a kopyasını gönder
          thumbs({:file_path=>file_path,:file=>file_path,:type=>:duplicate2,:new_file_path=>new_file_path})
          result = %w(true)
        end
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def file_rename(path,file_name)
      begin
        if File.exist?(path)
          folder_name = path.chomp(path.split('/').last).chomp('/')
          FileUtils.mv(path,folder_name+'/'+file_name)
          #thumbs'a kopyasını gönder
          thumbs({:file=>path,:target=>path,:type=>:rename,:folder_name=>folder_name,:file_name=>file_name})
          result = %w(true)
        else
          #return false Dosya Yok!
          result = %w(false)
        end
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def delete!(path)
      begin
        if File.exist?(path)
          FileUtils.rm_rf(path)
          FileUtils.rm_rf(path.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs')) if File.exist?(path.sub(@fcdir.chomp('/'), @fcdir.chomp('/')+'/.thumbs'))
          result = %w(true)
        else
          #return false Dosya Yok!
          result = %w(false 0)
        end
      rescue Exception => e
        result = ['false', '-1',e.to_s]
      end
      result
    end

    def upload(upload_files,path)
      begin
        image_mime_type = %w(image/x-ms-bmp image/jpeg image/gif image/png)
        file_path,error_delete_file = [],[]
        upload_files.each do |file|
          #dosya büyük
          return ['false', '0',format_mb(@max_file_size)] if file.tempfile.size > @max_file_size
          #format yok
          return ['false', '-1',@permission_mime.to_a] unless @permission_mime.has_key?(file.original_filename.split('.').last) || @permission_mime[file.original_filename.split('.').last]==file.content_type
          file_path.push(File.join(path,file.original_filename)) if image_mime_type.include?(file.content_type)
          error_delete_file.push(File.join(path,file.original_filename))
          File.open(File.join(path,file.original_filename), 'wb')  do |f|
            f.write(file.read)
          end
        end

        # resimleri yeniden boyutlandır
        image_resize(file_path)
        result = %w(true)
      rescue Exception => e
        error_delete_file.each do |file|
          FileUtils.rm_rf(file) unless File.size(file) > 0
        end
        result = ['false', '-2',e.to_s]
      end
      result
    end

    def edit_file(path)
      File.exist?(path) ?
          { :url => get_url(set_path(path)), :title => path.chomp('/').split('/').last } :
          %w(false 0)
    end

    def append_file(files_url)
      all_file,all_dir = {},{}
      Dir.glob(files_url).each do |file|
        if File.directory?(file)
          @main_file[:sub_dir] = true if @main_file[:sub_dir].nil?
          all_dir[file.split('/').last] = {:file=>file,:url => get_url(set_path(file)), :sub_dir => false, :size_2 => directory_size(file), :size => format_mb(directory_size(file)), :ctime => File.ctime(file).strftime('%d/%m/%Y %H:%M'), :path => set_path(file), :type => '_directory'}
          Dir.glob(file+'/*').each do |sub_dir|
            if File.directory?(sub_dir)
              all_dir[file.split('/').last][:sub_dir] = true
            end
          end
        else
          all_file[file.split('/').last] = {:file=>file, :path => set_path(file), :url => get_url(set_path(file)), :type => set_type(MIME::Types.type_for(file).first.content_type), :size_2 => File.size(file), :size => format_mb(File.size(file)), :ctime => File.ctime(file).strftime('%d/%m/%Y %H:%M')}
        end
      end
      { :directory => all_dir, :file => all_file }
    end


    def set_path(path)
      path.chomp('/').sub(@fcdir, 'fcdir:')
    end


    def get_path(path)
      path.chomp('/').sub('fcdir:',@fcdir)
    end


    def set_url(path)
      path.chomp('/').sub(File.join(@host_url,@main_folder)+@main_folder, 'fcdir:')
    end


    def get_url(path)
      path.chomp('/').sub('fcdir:',File.join(@host_url,@main_folder))
    end


    def set_type(type)
      case type
        when 'application/vnd.ms-word'
          'doc'
        when 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          'docx'
        when 'application/vnd.ms-excel'
          'xls'
        when 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          'xlsx'
        when 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          'pptx'
        when 'application/vnd.ms-powerpoint'
          'ppt'
        when 'application/pdf'
          'pdf'
        when 'application/xml'
          'xml'
        when 'application/x-shockwave-flash'
          'swf'
        when 'application/x-gzip', 'application/gzip'
          'gz'
        when 'application/x-gtar'
          'tgz'
        when 'application/x-bzip'
          'bz'
        when 'application/x-bzip2'
          'bz2'
        when 'application/zip'
          'zip'
        when 'application/x-rar', 'application/x-rar-compressed'
          'rar'
        when 'application/x-tar'
          'tar'
        when 'application/x-7z-compressed'
          '7z'
        when 'text/plain'
          'txt'
        when 'text/x-php', 'application/x-httpd-php'
          'php'
        when 'text/html'
          'html'
        when 'text/htm'
          'htm'
        when 'application/javascript'
          'js'
        when 'text/css'
          'css'
        when 'application/x-ruby'
          'rb'
        when 'image/tiff'
          'tiff'
        when 'image/x-targa'
          'tga'
        when 'image/vnd.adobe.photoshop'
          'psd'
        when 'image/x-icon'
          'ico'
        when 'audio/mpeg'
          'mp3'
        when 'audio/midi'
          'mid'
        when 'audio/ogg'
          'ogg'
        when 'audio/mp4'
          'mp4a'
        when 'audio/wav', 'audio/x-wav'
          'wav'
        when 'audio/x-ms-wma'
          'vma'
        when 'video/x-msvideo'
          'avi'
        when 'video/x-dv'
          'dv'
        when 'video/mp4'
          'mp4'
        when 'video/mpeg'
          'mpeg'
        when 'video/mpeg'
          'mpg'
        when 'video/quicktime'
          'mov'
        when 'video/x-ms-wmv'
          'vm'
        when 'video/x-flv'
          'flv'
        when 'video/x-matroska'
          'mkv'
        when 'image/png', 'image/jpeg','image/x-ms-bmp','image/gif'
          'image_file'
        else
          'other'
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
      conv = %w(B KB MB GB TER PB EB)
      scale = 1024
      ndx=1
      return "#{(size)} #{conv[ndx-1]}" if size < 2*(scale**ndx)
      size=size.to_f
      [2,3,4,5,6,7].each do |ndx|
        return "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}" if size < 2*(scale**ndx)
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
          #'rar'   => 'application/x-rar-compressed',
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
