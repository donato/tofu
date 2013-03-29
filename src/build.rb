
require 'fileutils'

includes = Dir["includes/*.js"]
pages = Dir["includes/pages/*.js"]

MAJOR_VERSION = 0.2;

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
    tofu.puts ("var version = " + MAJOR_VERSION.to_s + "." + Time.now.strftime("%y%m%d") + ";")
    tofu.puts includes.map { |f| IO.read(f) }
    tofu.puts pages.map { |f| IO.read(f) }
    tofu.puts IO.read("main.js")
}

puts "Final script compiled."