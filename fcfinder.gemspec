# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fcfinder/version'

Gem::Specification.new do |spec|
  spec.name          = "fcfinder"
  spec.version       = Fcfinder::VERSION
  spec.authors       = ["Furkan \xC3\x87elik"]
  spec.email         = ["furkan.celik32@gmail.com"]

  spec.summary       = %q{Rails icin web dosya gezgini}
  spec.description   = %q{Dosya yukleme klasor olusturma gibi islemleri yapabilirsiniz}
  spec.homepage      = "https://github.com/furkancelik/fcfinder"
  spec.license       = "MIT"

  
  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.9"
  spec.add_development_dependency "rake", "~> 10.0"
end
