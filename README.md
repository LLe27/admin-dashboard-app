# Company.inc Website

# Important Information
* This application is completely containerized. The two required tools are [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).
* The frontend application is hosted on `http://localhost:80`.
* The database is hosted on `http://localhost:8080`.
* It is important to keep in mind that the client side part of the application is hosted on `PORT:80` and NOT `PORT:8080`.


# Commands
To build the application, run the following command:
```docker-compose up --build```

To stop the application and remove all volumes:
```docker-compose down -v```

# Task List
- [x] Configure the environment with docker services
- [x] Set up RESTful API and basic CRUD operations
- [x] Set up MySQL database
- [x] Set up Vuejs frontend
- [ ] Set up proxy
- [ ] Data encryption integration
- [ ] JWT validation integration
- [x] Login/Signup form field validation
- [ ] Application routing and authentication
