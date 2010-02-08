require 'rails/generators'

class JqueryHelpersGenerator < Rails::Generators::Base
  
  def install_jquery_helpers
    copy_file(
      'jquery.rails.min.js',
      'public/javascripts/jquery.rails.min.js'
    )
    copy_file(
      'jquery.rails.js',
      'public/javascripts/jquery.rails.js'
    )
  end
  
  def self.source_root
    @source_root ||= File.expand_path(File.join(File.dirname(__FILE__), 'templates'))
  end

end
