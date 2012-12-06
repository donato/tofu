
require 'fileutils'

includes = Dir["includes/*.js"]
### `bash ./run.sh`

puts "Verifying included modules..."
includes.each do |f|
    output =  `jshint #{f}`
    if output.size > 0
        puts output
    else 
        puts "#{f} is OK."
    end
end


pages = Dir["includes/pages/*.js"]

puts "\nVerifying page specific files..."
pages.each do |f|
    output =  `jshint #{f}`
    if output.size > 0
        puts output
    else 
        puts "#{f} is OK."
    end
end


# Now lets throw it all together
File.open("tofu.user.js", "w") { |tofu|
    tofu.puts IO.read("lux_header.js")
    tofu.puts includes.map { |f| IO.read(f) }
    tofu.puts pages.map { |f| IO.read(f) }
    tofu.puts IO.read("lux_main.js")
    tofu.puts IO.read("lux_footer.js")
}

puts "Final script compiled."