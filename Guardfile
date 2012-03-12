guard 'coffeescript' do
  watch(%r{^.+\.coffee$})
end

guard 'sass' do
  watch(%r{^.+\.scss$})
end

guard 'rocco', :dir => 'doc/', :stylesheet => '../style/doc.css' do
  watch(%r{^.+\.coffee$})
end

guard 'livereload' do
  watch(%r{^.+\.(coffee|js|less|html|png)$})
  watch(%r{^images/.+\.png})
end
