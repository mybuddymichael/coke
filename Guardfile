guard 'less', :all_on_start => true, :all_after_change => true do
  watch(%r{^.+\.less$})
end

guard 'rocco', :dir => 'doc/', :stylesheet => '../style/doc.css' do
  watch(%r{^.+\.coffee$})
end

guard 'livereload' do
  watch(%r{^.+\.(coffee|js|less|html|png)$})
  watch(%r{^images/.+\.png})
end
