# BitBurg - Local Password Manager

## About
This project was developed as part of the **Web Engineering** course at the DHBW (Duale Hochschule Baden-Württemberg). 

BitBurg is a fully functional, locally hosted web application that serves as a secure password manager. It features robust database encryption to ensure the safe storage of your sensitive data and credentials.

---I

## Installation Guide
🚀 Bitburg Password Manager – Quick Setup (Ubuntu VM)

Kurzanleitung zur lokalen Installation des Bitburg Password Managers in einer Ubuntu-VM mit Nginx Reverse Proxy und MongoDB.

1️⃣ VM & Netzwerk konfigurieren

In VirtualBox → Adapter 2 auf Host-only Adapter stellen

VM starten und IP-Adresse ermitteln:

ip a

➡ IP notieren (z. B. 192.168.56.X)

2️⃣ Abhängigkeiten & MongoDB installieren

System aktualisieren und benötigte Pakete installieren:

sudo apt update && sudo apt upgrade -y
sudo apt install nginx git nodejs npm wget gnupg -y
MongoDB 7.0 Repository hinzufügen
wget -qO - https://pgp.mongodb.com/server-7.0.asc | sudo gpg --yes --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

Installation & Start:

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
3️⃣ SSL-Zertifikat (self-signed) erstellen
sudo mkdir -p /etc/nginx/ssl

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/nginx/ssl/bitburg.key \
-out /etc/nginx/ssl/bitburg.crt \
-subj "/CN=bitburg.local"
4️⃣ Nginx Reverse Proxy konfigurieren

Datei erstellen:

sudo nano /etc/nginx/sites-available/bitburg

Inhalt einfügen:

server {
    listen 80;
    server_name bitburg.local;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name bitburg.local;

    ssl_certificate /etc/nginx/ssl/bitburg.crt;
    ssl_certificate_key /etc/nginx/ssl/bitburg.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

Konfiguration aktivieren:

sudo ln -s /etc/nginx/sites-available/bitburg /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
5️⃣ Anwendung starten
git clone <DEINE_REPO_URL> bitburg
cd bitburg
npm install
node app.js
6️⃣ Windows Hosts-Datei anpassen

Editor als Administrator öffnen

Datei öffnen:

C:\Windows\System32\drivers\etc\hosts

Folgende Zeile hinzufügen (mit deiner VM-IP):

192.168.56.X    bitburg.local

Speichern.

7️⃣ Anwendung aufrufen

Im Browser öffnen:

https://bitburg.local

⚠ Browser-Warnung wegen Self-Signed-Zertifikat →
Erweitert → Weiter zu bitburg.local (unsicher)
### Required Technology 
To run this application locally, ensure you have the following software installed on your machine:
* **[Node.js](https://nodejs.org/)** (includes npm) - For the backend server.
* **[MongoDB](https://www.mongodb.com/)** - As the NoSQL database for storing encrypted entries and sessions.
* **[NGINX](https://nginx.org/)** - Acting as a reverse proxy and web server.

### Start NGINX
Before starting the application, ensure your NGINX server is running and configured to route traffic to your Node.js application (default port `3000`).
* **Windows:** Run the `nginx.exe` in your NGINX installation folder.
* **Linux/macOS:** ``` bash
  sudo systemctl start nginx
  # or
  sudo service nginx start ´´´
### Authors
Jakob Bohnert, Nikata Lechner, Philipp Schaude
