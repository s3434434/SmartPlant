# SmartPlant
API

open in visual studio -> tools ->NuGet Package Manager -> Package Manager Console -> "update-database" -> F5

rough example of layout

![alt text](https://i.imgur.com/Kpu1YoR.png)



API Methods (or just run the program in visual studio and check SwaggerUI)

<a href="https://gfycat.com/vagueacademicferret">How to use a token for authorization when testing the api</a>

LOGINS: username - password
user user
admin admin


Accounts:

	[Post]
	/api/account/register
	Takes in param matching UserRegistrationDto.cs
	(Email, password, confirmation password)
	password length must be 3 char - changable in startup.cs line 42-46
	
	[Post]
	/api/Account/Login
	default logins: 
	user user
	admin admin
	returns a JWT token, used for authorization

	To logout, on frontend remove token from localstorage/cookie?


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

	[Get] [Admin]
	/api/Admin/Plants/UserID/{id}
	Takes in a userID
	Returns all plants belonging to the specific user

	[Post] [Admin]
	api/Admin/Plants
	Creates a new plant
	Takes in a UserID - UserID must exist on database
	

Sensor Data:
	

	[Get]
        /api/SensorData/{plantID}
        returns all sensor data for a plantID

 	[Get]
	/api/SensorData/{plantID}/Daily
        returns all sensor data for a plantID whose timestampUTC matches the current day

	[Get]
        /api/SensorData/{plantID}/Monthly
	returns all sensor data for a plantID whose timestampUTC matches the current month

	[Post]
	/api/SensorData
        creates new sensor data
	input must match the SensorDataModel class

	[Get][Admin]
        /api/SensorData/All
	returns ALL sensor data - don't think this is needed
	
