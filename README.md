# SmartPlant
API

open in visual studio -> tools ->NuGet Package Manager -> Package Manager Console -> "update-database" -> F5

rough example of layout

![alt text](https://i.imgur.com/Kpu1YoR.png)



API Methods (or just run the program in visual studio and check SwaggerUI)

LOGINS: username - password
user user
admin admin


Accounts:

	[Post]
	/api/account/register
	Takes in param matching UserRegistrationDto.cs
	password length must be 3 char - changable in startup.cs line 42-46
	
	[Post]
	/api/Account/Login
	default logins: 
	user user
	admin admin
	returns a JWT token, used for authorization

	To logout, on frontend remove token from localstorage/cookie?


Plants:
	[Get] [Admin]
	/api/plants
	
	Returns all plants (plantID, userID)

	[Get] //gets all plants (plantid, userid) for the user
	/api/User/{id}/Plants
	Returns all plants beloning to a userID

	[Post] 
	api/Plant
	Creates a new plant
	Takes in PlantID, UserID - UserID must exist on database
	

Sensor Data:
	[Get][Admin]
        /api/SensorData/All
	returns ALL sensor data - don't think this is needed

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
	
	
	![](https://gfycat.com/vagueacademicferret)
