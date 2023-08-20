FROM nginx

COPY build /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html
