require "fcfinder/version"
require "fcfinder/engine"

module Fcfinder
  class Connector
		def initialize(file,url_params=nil)
			
			@fcdir = file.chomp("/*")
			@main_file = {}
			
			unless url_params.nil?
				p url_params
				url_params = get_path(url_params)
				@url_params = append_file(url_params+"/*") 
			else
				@main_params = append_file(file)
				@main_params[:main_file] = { path:file.split("/")[-2],url:file,sub_dir:@main_file[:sub_dir]} 	
			end
			
						
		end
		
		def append_file(files_url)
			all_file,all_dir = {},{}
			Dir.glob(files_url).each do |file|
				if File.directory?(file)
					@main_file[:sub_dir] = true if @main_file[:sub_dir].nil?
					all_dir[file.split("/").last] = {url:set_path(file),sub_dir: false }
					Dir.glob(file+"/*").each do |sub_dir|
						if File.directory?(sub_dir)
							all_dir[file.split("/").last][:sub_dir] = true
						end
					end
				else
					all_file[file.split("/").last] = set_path(file)
				end
			end
			{directory:all_dir,file:all_file}
		end
		
		
		def set_path(path)
			path.sub(@fcdir,"fcdir:")
		end
		
		def get_path(path)
			path.sub("fcdir:",@fcdir)
		end
		
		
		def run
			if @url_params.nil?
				@main_params.to_json
			else
				@url_params.to_json
			end
			
		end
	end
end
