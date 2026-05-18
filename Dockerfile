FROM nginx:alpine

# Static site assets
COPY index.html styles.css app.js punta-magica.mp4 /usr/share/nginx/html/

# nginx:alpine auto-runs envsubst on files in /etc/nginx/templates/ at startup,
# so ${PORT} gets replaced with Railway's injected port (or 8080 locally).
COPY default.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080
