module Fcfinder
  class Engine < ::Rails::Engine
    initializer "fcfinder.assets.precompile" do |app|
      #app.config.assets.precompile += %w(../../vendor/assets/fcfinder/*)
      #app.config.assets.precompile += %w(../vendor/assets/images/fcfinder/*)
      #app.config.assets.precompile += %w(fcfinder.css.erb)
      app.config.assets.precompile += %w(assets/images/fcfinder/*)
      app.config.assets.precompile += %w(fcfinder.css)
      app.config.assets.precompile += %w(fcfinder.js)
    end
  end
end
