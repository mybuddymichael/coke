guard 'coffeescript' do
  watch(%r{.+\.coffee$})
end

guard 'sass', output: 'style' do
  watch(%r{^.+\.scss$})
end

guard 'rocco', :dir => 'doc/', :stylesheet => '../style/doc.css' do
  watch(%r{[^test].+\.coffee$})
end

guard 'livereload' do
  watch(%r{^.+\.(js|css|html|png)$})
  watch(%r{^images/.+\.png})
end
