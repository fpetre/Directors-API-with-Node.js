# Directors-API-with-Node.js
A simple API that registers and lists all the movie directors having an account on Livestream (like James Cameron, Martin Scorsese, etc.).

TO REGISTER A DIRECTOR:

send a POST request to api_url/directors with livestream account id as a parameter

POST http://api_url/directors

{
  "livestream_id":"6488834"
}

Response:

{
  "livestream_id": "6488834",
  "full_name": "Steven Spielberg",
  "dob": "1946-12-18T00:00:00.000Z",
  "favorite_camera": "",
  "favorite_movies": [ ]
}


TO GET A LIST OF REGISTERED DIRECTORS:

send a GET request to api_url/directors

GET http://api_url/directors

Response:

[
{
  "_id": "54b3528a6539468b59000001",
  "favorite_camera": "",
  "dob": "1946-12-18T00:00:00.000Z",
  "full_name": "Steven Spielberg",
  "livestream_id": "6488834",
  "__v": 0,
  "favorite_movies": [ ]
  },
  {
    "_id": "54b353096539468b59000002",
    "favorite_camera": "",
    "dob": "1986-12-11T00:00:00.000Z",
    "full_name": "Crystal Hybrid Perez",
    "livestream_id": "6488835",
    "__v": 0,
    "favorite_movies": [ ]
  }
  ]


TO GET ONE DIRECTOR BY ID:

send a GET request to api_url/directors/director_id

GET http://localhost:3000/directors/54b3528a6539468b59000001

Response:

{
  "_id": "54b3528a6539468b59000001",
  "favorite_camera": "",
  "dob": "1946-12-18T00:00:00.000Z",
  "full_name": "Steven Spielberg",
  "livestream_id": "6488834",
  "__v": 0,
  "favorite_movies": [ ]
}



TO UPDATE A DIRECTOR:

send a PUT request to api_url/directors/director_id with an md5 hash of the full_name

PUT http://localhost:3000/directors/54b3528a6539468b59000001

Header: 'Authorization': 'Bearer 407655d5d5b702326b26f4df704e'

body:

{
  favorite_camera: "Sony F65",
  favorite_movies: Terminator
}

Response:

{
  "livestream_id": "6488835",
  "full_name": "Crystal Hybrid Perez",
  "dob": "1986-12-11T00:00:00.000Z",
  "favorite_camera": "SONY F65",
  "favorite_movies": [
  "Terminator"
  ]
}


TO DELETE A DIRECTOR:

send a DELETE request to api_url/directors/director_id

DELETE http://localhost:3000/directors/54b3528a6539468b59000001

Response:

{
  "message": "Successfully deleted"
}
