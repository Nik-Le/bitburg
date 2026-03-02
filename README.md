# BitBurg - Local Password Manager

## About
This project was developed as part of the **Web Engineering** course at the DHBW (Duale Hochschule Baden-Württemberg). 

BitBurg is a fully functional, locally hosted web application that serves as a secure password manager. It features robust database encryption to ensure the safe storage of your sensitive data and credentials.

---I

## Installation Guide

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
