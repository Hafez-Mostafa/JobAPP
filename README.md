# 🚀 JOBAPP-MAIN

## 🧩 Überblick

**JOBAPP-MAIN** ist eine einfache Job-Backend-Anwendung, die im Rahmen eines Backend-Entwicklerkurses erstellt wurde.

Die Anwendung basiert auf der **MVC-Architektur** und wurde mit **Node.js** und **Express.js** entwickelt.

🎯 Ziel des Projekts ist es, grundlegende Backend-Konzepte zu erlernen, wie:
- Routing
- Datenverarbeitung
- Strukturierte Code-Organisation

---

## ⚙️ Funktionen

### 👤 Benutzerverwaltung
- Registrierung (Sign Up)
- Anmeldung (Login)
- E-Mail-Bestätigung
- Benutzer löschen
- Passwort zurücksetzen

### 💼 Jobs & Unternehmen
- Jobs erstellen, bearbeiten, löschen, abrufen
- Unternehmen verwalten (CRUD)

### 📄 Bewerbungen
- Bewerbungen auf Jobs erstellen

---

## 🏗️ Architektur & Technologien

### 🔧 Verwendete Technologien

- **Node.js** – Backend-Laufzeitumgebung  
- **Express.js** – Webframework für APIs und Routing  
- **MongoDB** – NoSQL-Datenbank  
- **Mongoose** – ODM zur Datenmodellierung  
- **JWT (JSON Web Token)** – Authentifizierung  

---

## 🧱 Architekturprinzip (MVC)

Die Anwendung folgt dem MVC-Muster:

- **Model** → Definiert die Datenstruktur (z. B. User, Job, Company)  
- **Controller** → Enthält die Geschäftslogik  
- **Routes** → Definiert die API-Endpunkte  

---

## 🌐 API-Struktur

### Basis-Routen

| Route | Beschreibung |
|------|-------------|
| `/users` | Benutzerverwaltung |
| `/company` | Unternehmensverwaltung |
| `/jobs` | Job-Management |
| `/applications` | Bewerbungen |

---

## 🖥️ Server

Der Server wird mit Express initialisiert und enthält:

- CORS-Konfiguration
- JSON Middleware
- Routenverwaltung
- Globale Fehlerbehandlung

---

## 📡 API-Dokumentation (Postman)

👉 Hier kannst du alle Endpunkte testen:

🔗 [Postman Collection öffnen](https://blue-shuttle-937874.postman.co/workspace/Mosmoyas~33af06e5-6e6f-4ea1-8617-306faaf1f85d/collection/9521947-fb27d53a-deac-4042-867f-858eae64478a?action=share&creator=9521947)

---

## 🚀 Installation & Setup

```bash
git clone <repository-url>
cd JOBAPP-MAIN
npm install
npm start
