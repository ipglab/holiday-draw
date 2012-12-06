# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|

  config.vm.define :web do |web_config|
    # Every Vagrant virtual environment requires a box to build off of.
    web_config.vm.box = "precise64"
    # The url from where the 'config.vm.box' box will be fetched if it
    # doesn't already exist on the user's system.
    web_config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    # Assign this VM to a host-only network IP, allowing you to access it
    # via the IP. Host-only networks can talk to the host machine as well as
    # any other machines on the same network, but cannot be accessed (through this
    # network interface) by any external networks.
    web_config.vm.network :hostonly, "10.11.12.100"
    # Forward a port from the guest to the host, which allows for outside
    # computers to access the VM, whereas host only networking does not.
    web_config.vm.forward_port 80, 8080
    # Set the fully qualified domain name for this host
    web_config.vm.host_name = "holiday.webvm.bryanwrit.es"

    # Share an additional folder to the guest VM. The first argument is
    # an identifier, the second is the path on the guest to mount the
    # folder, and the third is the path on the host to the actual folder.
    # config.vm.share_folder "v-data", "/vagrant_data", "../data"

#    web_config.vm.provision :puppet_server do |puppet|
#      puppet.puppet_server = "puppet.bryanwrit.es"
#      puppet.puppet_node = "holiday.webvm.bryanwrit.es"
#      puppet.options = ["--environment=bryanjswift", "--runinterval=60"]
#    end
  end

end
