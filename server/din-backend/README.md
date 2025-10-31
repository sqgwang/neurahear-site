Digit-in-Noise backend (server/din-backend)

Quick start (development)

1. cd server/din-backend
2. npm install
3. Create a data directory or let the server create one (defaults to ./data).
4. Start the server:

   PORT=4000 JWT_SECRET='your_jwt_secret' DATA_DIR=$(pwd)/data ADMIN_BOOT_PASSWORD='localAdminPass' npm start

Notes
- The server persists user data to DATA_DIR/users.json and results to DATA_DIR/results.jsonl.
- For local development you can set secure cookie behavior by editing server.js (secure: false) but in production keep secure: true and serve via HTTPS.

Production suggestions
- Run behind an HTTPS reverse proxy (nginx) so SameSite=None + secure cookies work.
- Use a process manager (pm2 or systemd) or run in Docker.
- Set ALLOWED_ORIGINS env to a comma-separated list of front-end origins.

Example systemd unit (brief):

[Unit]
Description=DIN Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/neurahear-site/server/din-backend
ExecStart=/usr/bin/env PORT=4000 JWT_SECRET=<<SECRET>> DATA_DIR=/var/lib/din-backend ADMIN_BOOT_PASSWORD=<<PASS>> /usr/bin/npm start
Restart=always
```markdown
Digit-in-Noise backend (server/din-backend)

Quick start (development)

1. cd server/din-backend
2. npm install
3. Create a data directory or let the server create one (defaults to ./data).
4. Start the server:

   PORT=4000 JWT_SECRET='your_jwt_secret' DATA_DIR=$(pwd)/data ADMIN_BOOT_PASSWORD='localAdminPass' npm start

Notes
- The server persists user data to DATA_DIR/users.json and results to DATA_DIR/results.jsonl.
- For local development you can set secure cookie behavior by editing server.js (secure: false) but in production keep secure: true and serve via HTTPS.

Production suggestions
- Run behind an HTTPS reverse proxy (nginx) so SameSite=None + secure cookies work.
- Use a process manager (pm2 or systemd) or run in Docker.
- Set ALLOWED_ORIGINS env to a comma-separated list of front-end origins.

Docker (quick)

1. Build image:

   docker build -t neurahear/din-backend:latest .

2. Run container (persist data to host ./data):

   docker run -d --name din-backend -p 4000:4000 -e JWT_SECRET=<<SECRET>> -v $(pwd)/data:/data neurahear/din-backend:latest

Or use docker-compose:

   docker-compose up -d --build

Nginx reverse-proxy (example)

Place the provided `nginx.d/din-backend.conf` under your nginx sites and update `server_name` and TLS paths. This configuration proxies `/api/` to the backend and `/tools/digit-in-noise-test/` to your static front-end host.

systemd unit (example)

See `systemd/din-backend.service` for a ready-to-edit unit. Example usage on a server:

1. Create a data directory (e.g., `/var/lib/din-backend`) and ensure the service user (e.g. `www-data`) can write it.
2. Drop `din-backend.service` into `/etc/systemd/system/` and edit `WorkingDirectory` and environment values.
3. Enable and start:

   sudo systemctl daemon-reload
   sudo systemctl enable --now din-backend

pm2 (optional)

Use `ecosystem.config.js` and `pm2` to run the app with process management if preferred.

Security notes
- Always set a strong `JWT_SECRET` in production.
- Set `ALLOWED_ORIGINS` to your front-end origin(s) (comma-separated) so CORS allows browser requests.
- Serve the front-end and backend over HTTPS so cookies with `secure: true` are accepted by browsers.

Maintenance
- Keep backups of `data/results.jsonl` if you plan to run long-term studies.
- Consider switching to a proper database for scaling and search.

``` 
