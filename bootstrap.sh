#!/bin/sh

CONNECTION_STRING="$1"
PACKAGES="lsb python-pip build-essential libxml2-dev puppet-common"

remote_cmd() {
    ssh -t $CONNECTION_STRING "$1"
}

ssh-copy-id $CONNECTION_STRING

remote_cmd "
cd /tmp; 
wget http://apt.puppetlabs.com/puppetlabs-release_1.0-3_all.deb;
dpkg -i ./puppetlabs-release_1.0-3_all.deb;
apt-get update
apt-get install $PACKAGES -y"

scp "`pwd`/configs/puppet_default" "$CONNECTION_STRING:/etc/default/puppet"

remote_cmd "
apt-get upgrade -y;
mkdir -p /etc/puppet/modules"

scp -r "`pwd`/puppet_modules/uwsgi_node" "$CONNECTION_STRING:/etc/puppet/modules"

remote_cmd "puppet apply /etc/puppet/modules/uwsgi_node/manifests/init.pp"
