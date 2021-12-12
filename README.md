## This is a very simple service for demonstration and use in development server. Not Production Ready
### Project Structure
* LPS: For Backend API in Django Rest Framework and Postgres DB
* frontend: For Frontend UI in ReactJS
* docker-compose.dev.yml: For Containerizing the app
### Steps to start the project (using Docker)
* You must need Docker in your local machine(Version 14)
* Open frontend folder in a terminal and run **npm install** (Makes faster project start)
* Now Open a terminal in project root directory(where docker-compose file exists) and run **docker-compose -f docker-compose.dev.yml up --build**
* After successful run of the services open another terminal and run **docker-compose -f docker-compose.dev.yml exec backend bash**
* Above command will allow you access in backend folder inside docker.
* Inside the backend terminal Run **python manage.py makemigrations** for migrating models and setup your database.
* Inside the backend terminal Run **python manage.py migrate** for Database impact of the created models.
* Inside the backend terminal Run **python manage.py create_super_user 1234**
* Above command will create a superuser with username ***su@gmail.com*** and password ***1234***. Change the password in command line if needed.
* Hit http://localhost:3000 for accessing the UI and login as ***su***. If raise error try reloading the page.
* Create Employees and Restaurants. Remember adding an Employee and Restaurant will automatically create an user in the system. **Email** field of Employee and Restaurant will be auto considered as username.
* Employee User can only see the menu uploaded by restaurants for current date and can also se the current dates winner when the voting is done. Employee User can vote for only one menu for current date. If no menu uploaded employee can't vote.
* Restaurant user can only upload menu for current date and can see current date winner.
* Su user can add employee and restaurant. Su user process the current date winner.


### Limitations
As said earlier this is a very simple project made in 2 day effort. There are lots of improvement to make.
For example:
* Event driven MSA(micro service architecture) for handling user vote event for a menu
* Django user model for user handling and more beautiful way to handle JWT
* More tests
* More automated
* More UI (Though I am not very good at making pixel perfect UI, but with time I can make better)


### Reason behind Limitations
* As I am currently employed, I couldn't manage much time.