
require 'fileutils'

includes = Dir["includes/*.js"]
pages = Dir["includes/pages/*.js"]

### `bash ./run.sh`
=begin
puts "Verifying included modules..."
includes.each do |f|
    output =  `jshint #{f}`
    if output.size > 0
        puts output
    else 
        puts "#{f} is OK."
    end
end



puts "\nVerifying page specific files..."
pages.each do |f|
    output =  `jshint #{f}`
    if output.size > 0
        puts output
    else 
        puts "#{f} is OK."
    end
end
=end

# Now lets throw it all together
File.open("tofu.user.js", "w") { |tofu|
    tofu.puts IO.read("greasemonkey_header.js")
    tofu.puts includes.map { |f| IO.read(f) }
    tofu.puts pages.map { |f| IO.read(f) }
    tofu.puts IO.read("main.js")
}

puts "Final script compiled."