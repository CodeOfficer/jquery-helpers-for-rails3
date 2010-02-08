Gem::Specification.new do |s|
  s.name    = 'jquery_helpers'
  s.version = '0.0.0'
  s.date = %q{2010-02-08}
  s.authors = ["Russell Jones"]
  s.email = %q{spam@codeofficer.com}
  s.description = %q{A port of the unobtrusive Prototype helpers in Rails 3 to jQuery}
  s.summary = %q{jQuery helpers for Rails 3}
  s.homepage = %q{http://github.com/CodeOfficer/jquery-helpers-for-rails3}
  s.require_paths = ["lib", "lib/generators"]
  s.files = [
    "lib/generators/jquery_helpers.rb",
    "lib/generators/jquery_helpers/jquery_helpers_generator.rb",
    "lib/generators/jquery_helpers/templates/jquery.rails.js",
    "lib/generators/jquery_helpers/templates/jquery.rails.min.js",
    "lib/generators/jquery_helpers/USAGE",
    "jquery_helpers.gemspec"
  ]
  s.add_dependency 'rails', '3.0.0.beta'
end
