FROM nginx:alpine

# Static site assets
COPY index.html styles.css app.js punta-magica.mp4 /usr/share/nginx/html/

# Replace nginx's default server config (which listens on 80) with ours (8080).
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
