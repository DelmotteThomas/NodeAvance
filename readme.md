Pour tester les routes BACKEND 

Utilisation de CURL 

curl URL                     # GET simple
curl -I URL                  # headers + status
curl -v URL                  # debug complet
curl -X POST URL             # POST
curl -H "Content-Type: application/json" URL
$


GET

curl http://localhost:8080/api/todos

POST / CREER UNE RESOURCE

curl -X POST http://localhost:8080/api/todos -H "Content-Type: application/json" -d '{"title": "Mon titre de test"}'

// Test si le serveur est UP

curl http://localhost:8080


example : 

Test si boostrap est UP

curl.exe -I http://localhost:8080/bootstrap/css/bootstrap.min.css



FLUX 

HTTP request
   ↓
routes
   ↓
controller
   ↓
service
   ↓
model
   ↓
service
   ↓
controller
   ↓
HTTP response