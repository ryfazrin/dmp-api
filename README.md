# HOW TO RUN

Run 
```
pnpm i

pnpm run serve
```

if command show 
```
Server running at port: 5000
MySQL Connected...
```
Server is run.

## add Database MySQL
Install Database user with MariaDB or MySQL. With database name `dmp-accounts`

Database in /db/users.sql

## API contract/Request Data

Use Posman to try API

```
// Login
POST: http://localhost:5000/api/login
REQUEST BODY: 
{
    "username": "ryan",
    "password": "12345"
}

// Logout
POST: http://localhost:5000/api/logout
REQUEST BODY: 
{
    "username": "ryan"
}

// Get All Jobs
GET: http://localhost:5000/api/jobs

// Get All Jobs per page
GET: http://localhost:5000/api/jobs?page=1

// Get Jobs with filter description || location || type
http://localhost:5000/api/jobs?description=YOUR_DESCRIPTION&location=YOUR_LOCATION&type=YOUR_TYPE

// Get single Job by id
GET: http://localhost:5000/api/jobs/:id

// all endpoint required:
headers: {
  'my-secret-key': 'MY_TOKEN'
}
```