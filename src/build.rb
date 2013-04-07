
require 'fileutils'

includes = Dir["includes/*.js"]
pages = Dir["includes/pages/*.js"]
plugins = Dir["includes/plugins/*.js"]

install_dir = "C:/Users/Donato/AppData/Roaming/Mozilla/Firefox/Profiles/b5pixhso.default/gm_scripts/ToFu_Script/"

MAJOR_VERSION = 0.2;

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

# Now lets throw it all together
File.open("tofu.user.js", "w") { |tofu|
    tofu.puts IO.read("greasemonkey_header.js")
    tofu.puts ("var version = '" + MAJOR_VERSION.to_s + "." + Time.now.strftime("%y%m%d") + "';")
    tofu.puts includes.map { |f| IO.read(f) }
    tofu.puts pages.map { |f| IO.read(f) }
    tofu.puts plugins.map { |f| IO.read(f) }
    tofu.puts IO.read("main.js")
}

puts "Final script compiled."

# Now overwrite the version in Firefox
FileUtils.cp 'tofu.user.js', install_dir+"tofu.user.js"