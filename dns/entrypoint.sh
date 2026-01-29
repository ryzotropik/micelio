#!/bin/sh
set -e

# Ensure permissions
if [ -d "/etc/bind" ]; then
  chown -R named:named /etc/bind || true
fi

# Start named in foreground as the named user
exec /usr/sbin/named -g -u named -c /etc/bind/named.conf
