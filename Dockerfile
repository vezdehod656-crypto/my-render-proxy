FROM alpine:latest

RUN apk add --no-cache tinyproxy stunnel

# Создаём сертификат для HTTPS (самоподписанный)
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/tinyproxy/key.pem \
    -out /etc/tinyproxy/cert.pem -days 365 -nodes \
    -subj "/C=RU/ST=State/L=City/O=Org/CN=localhost"

# Настраиваем stunnel для приёма HTTPS и проброса в Tinyproxy (HTTP)
RUN echo "cert = /etc/tinyproxy/cert.pem" > /etc/stunnel/stunnel.conf && \
    echo "key = /etc/tinyproxy/key.pem" >> /etc/stunnel/stunnel.conf && \
    echo "[tinyproxy]" >> /etc/stunnel/stunnel.conf && \
    echo "accept = 443" >> /etc/stunnel/stunnel.conf && \
    echo "connect = 127.0.0.1:8888" >> /etc/stunnel/stunnel.conf

# Настраиваем Tinyproxy
RUN echo 'User nobody' > /etc/tinyproxy/tinyproxy.conf && \
    echo 'Group nobody' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Port 8888' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Timeout 600' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'LogLevel Info' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'MaxClients 100' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Allow 0.0.0.0/0' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Allow ::/0' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'ConnectPort 443' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'ConnectPort 80' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'DisableViaHeader Yes' >> /etc/tinyproxy/tinyproxy.conf

EXPOSE 443

CMD sh -c "tinyproxy -c /etc/tinyproxy/tinyproxy.conf & stunnel && tail -f /dev/null"
