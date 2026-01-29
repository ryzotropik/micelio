FROM alpine:3.19

RUN apk add --no-cache bind bind-tools

RUN mkdir -p /etc/bind/zones \
    && chown -R named:named /etc/bind

COPY named.conf /etc/bind/named.conf
COPY named.conf.options /etc/bind/named.conf.options
COPY zones/ /etc/bind/zones/
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 53/udp 53/tcp

STOPSIGNAL SIGINT

CMD ["/entrypoint.sh"]
