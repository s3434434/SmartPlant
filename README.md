# SmartPlant
API

open in visual studio -> tools ->NuGet Package Manager -> Package Manager Console -> "update-database" -> F5

rough example of layout

![alt text](https://i.imgur.com/Kpu1YoR.png)



API Methods (or just run the program in visual studio and check SwaggerUI)

<a href="https://gfycat.com/vagueacademicferret">How to use a token for authorization when testing the api</a>

Currently the email address is used to login, and by default the username is set to the email.

LOGINS: username - password

user user

admin admin

Everything except Register and Login requires a user to be logged in to use.

Accounts:

	[Post]
	/api/account/register
	Takes in param matching UserRegistrationDto.cs
	(Email, password, confirmation password) -- ToDo send Email confirmation?
	password length must be 3 char - changable in startup.cs line 42-46

	**WARNING - THIS ACTUALLY SENDS A CONFIRMATION EMAIL LINK TO THE INPUTTED EMAIL**
	Currently, the token is also sent back in the response body, for easier copy/paste testing


	[Get]
	/api/ConfirmEmail
	Takes in email and token from a querystring - from the sent confirmation email
	Confirms a user's email - users need to confirm their email before being able to login.
	
	[Post]
	/api/Account/Login
	default logins: 
	user user
	admin admin
	returns a JWT token, used for authorization

	To logout, on frontend remove token from localstorage?

	
	
	[Put]
	/api/User
	Updates the current user's details - FirstName, LastName, PhoneNumber

	[Put]
	/api/User/Email
	Updates the current user's Email -- ToDo send Email confirmation?
	This also changes the users username - as it's the same as their email.

	[Put]
	/api/User/Password
	Updates the current user's password.

	
	
	[Get] [Admin]
	/api/Admin/Users
	Returns all users (ID, Email)  - format of AdminGetAllUsersDto.cs

	[Get] [Admin]
	/api/Admin/User	
	Returns a specific user's details (FirstName, LastName, Email, PhoneNumber)	

	[Put] [Admin]
	/api/Admin/User	
	Updates a user's details (FirstName, LastName, Email, PhoneNumber)
	- also takes in ID but this can't be changed
	format of AdminUpdateUserDetailsDto.cs


	[Get] [Admin]
	/api/Admin/User/Role
	Returns a list of users and their roles (userID, email, role)

	[Put] [Admin]
	/api/Admin/User/Role
	Updates a user's role - from user to admin, admin to user.
	format of AdminUpdateUserRole.cs

	[Put] [Admin]
	/api/Admin/User/Role/Password
	Updates a user's password 
	

Plants:

	[Get]
	/api/Plants
	Returns all plants belonging to the current user.	

	[Post]
	/api/Plants
	Creates a new plant for the current logged in user.
	Currently max of 5 per user, changeable in PlantManager.cs: line 14.



	[Get] [Admin]
	/api/Admin/Plants	
	Returns all plants for all users (plantID, userID)
	
	[Post] [Admin]
	api/Admin/Plants
	Creates a new plant
	Takes in a UserID - UserID must exist on database


	[Get] [Admin]
	/api/Admin/Plants/User/{id}
	Takes in a userID
	Returns all plants belonging to the specific user

		

Sensor Data:
	

	[Get]
        /api/SensorData/
        Returns all sensor data for all plants owned by the current user
	
	[Post]
	/api/SensorData
        Creates new sensor data
	input must match the SensorDataModel class


	
	[Get]
	/api/SensorData/{plantID}
	Returns all sensor data for a plant 
	Must belong to the current user.
	
 	[Get]
	/api/SensorData/Daily/{plantID}
        Returns sensor data for a plantID whose timestampUTC matches the current day
	The plantID must belong to the user.

	[Get]
        /api/SensorData/Monthly/{plantID}
	Returns sensor data for a plantID whose timestampUTC matches the current month
	The plantID must belong to the user.
	


	[Get] [Admin]
        /api/Admin/SensorData
	Returns ALL sensor data - don't think this is needed? maybe for extra graphs/overall statisics
	
	[Get] [Admin]
	/api/Admin/SensorData/{plantID}	
	Returns all sensor data for a specific plant

	[Get] [Admin]
	/api/Admin/SensorData/Daily/{plantID}
	Returns daily sensor data for a specific plant

	[Get] [Admin]
	/api/Admin/SensorData/Monthly/{plantID}
	Returns monthly sensor data for a specific plant


	[Post] [Admin] [TESTING]
	/api/Admin/ForTesting/SensorData
	Just used this to add sensor data to test daily/monthly 
	
	









ToDo: verification email
email for sending verification: SmartPlantTeam4@gmail.com, thisisagoodpassword, 1-1-2000
