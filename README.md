# SmartPlant
API

open in visual studio -> tools ->NuGet Package Manager -> Package Manager Console -> "update-database" -> F5

rough example of layout

![alt text](https://i.imgur.com/Kpu1YoR.png)



API Methods (or just run the program in visual studio and check SwaggerUI)

<a href="https://gfycat.com/vagueacademicferret">How to use a token for authorization when testing the api</a>

Currently the email address is used to login, and by default the username is set to the email.

Authentication and Authorization done with asp.net Identity and JWT tokens.

LOGINS: username - password

user user

admin admin

Everything except Register, Login, ConfirmEmail, Forgot Password, and Reset Password requires a user to be logged in to use.

Accounts:

	[Post]
	/api/account/register
		Takes in param matching UserRegistrationDto.cs
		(FirstName, LastName, Email, password, confirmation password, URI for confirmation route)
		password length must be 3 char - changeable in startup.cs line 42-46
	format of userRegDto.cs
				Returns: BadRequest - 400  invalid input
					 BadRequest - 400  with List of errors, failed registration
						 Ok - 200  If successfull
					 



	**WARNING - THIS ACTUALLY SENDS A CONFIRMATION EMAIL LINK TO THE INPUTTED EMAIL**
	Currently the token is also sent back in the response body, for easier copy/paste testing


	[Get]
	/api/ConfirmEmail
		Takes in email and token from a querystring - from the sent confirmation email
		Confirms a user's email - users need to confirm their email before being able to login.
		
				Returns: BadRequest - 400  invalid input
					 BadRequest - 400  w/ msg "Invalid Email Confirmation Request - Something Went Wrong"
					 	 Ok - 200  w/ msg "Email Confirmed"
	[Post]
	/api/Account/Login
		default logins: 
		user user
		admin admin
		returns a JWT token, used for authorization
	format of UserForAuthenticationDto.cs

				Returns: Unauthorized - 401  w/ error msg
						   Ok - 200  w/ Token

	To logout, on frontend remove token from localstorage?

	
	[Post]
	/api/Account/Password/Forgot
		Sends a reset link via email with a reset token.
		Current the token is sent back in the response body.
	format of ForgotPasswordDto.cs
				
				Returns: BadRequest - 400
					 BadRequest - 400  w/ msg "Email not found"
  						 Ok - 200  w/ Token for confirming reset (only returned now for easier testing, remove token later)


	[Post]
	/api/Account/Password/Reset
		Takes in an email and token (from the forgot password email)
		and a new password.
	format of ResetPasswordDto.cs
	
				Returns: BadRequest - 400
					 BadRequest - 400  w/ list of errors
					 	 Ok - 200
	[Get]	
	/api/User
		Gets the current users info
		firstname, lastname, email, phonenumber
				
				Returns: NotFound - 400  msg "User Not Found"
					       Ok - 200  firstname, lastname, email, phonenumber

	[Put]
	/api/User
		Updates the current user's details - FirstName, LastName, PhoneNumber
	format of UpdateUserDetailsDto.cs

				Returns: BadRequest - 400
						 Ok - msg "Success"

	[Put]
	/api/User/Email
		Updates the current user's Email -- ToDo send Email confirmation?
		This also changes the users username - as it's the same as their email.
	format of UpdateEmailDto.cs

				Returns: BadRequest - 400
					 BadRequest - 400  msg "User Does Not Exist" or "Email Already Taken" - these really shouldn't happen
					 	 Ok - 200  msg "New email is the same as current. Email not changed."
						 Ok - 200  msg "Success"
			 

	[Put]
	/api/User/Password
		Updates the current user's password.
	format of UpdatePasswordDto.cs

				Returns:   BadRequest - 400
					 Unauthorized - 401  msg "Old Password Incorrect"
						   Ok - 200  msg "Password Changed"

	
	
	[Get] [Admin]
	/api/Admin/Users
		Returns all users (ID, Email)  - format of AdminGetAllUsersDto.cs

				Returns: NotFound - 404  msg "No Users Found"
					       Ok - 200  list of 'AdminGetAllUsersDto' (userid, email)

	[Get] [Admin]
	/api/Admin/User	
		Returns a specific user's details (FirstName, LastName, Email, PhoneNumber)
	
				Returns: NotFound - 404  if no matching user found
					       Ok - 200  returns UserDetailsDto  (firstname, lastname, email, phonenumber)

	[Put] [Admin]
	/api/Admin/User	
		Updates a user's details (FirstName, LastName, Email, PhoneNumber)
		- also takes in ID but this can't be changed
	format of AdminUpdateUserDetailsDto.cs

				Returns: BadRequest - 400
				   	 	 Ok - 200  returns AdminUpdateUserDetailsDto (id, firstname, lastname, email. phonenumber) - same as info passed thru


	[Delete] [Admin]
	/api/Admin/User
		Deletes the user associated with the userID

				Returns:  Ok - 200  w/ List<AdminGetRoleListDto> (id, email, role)

	[Get] [Admin]
	/api/Admin/User/Role
		Returns a list of users and their roles (userID, email, role)	

				Returns: BadRequest - 400
						 Ok - 200  returns AdminUpdateUserRoleDto (id, role)

	[Put] [Admin]
	/api/Admin/User/Role
		Updates a user's role - from user to admin, admin to user.
	format of AdminUpdateUserRole.cs

				Returns: BadRequest - 400
					   NotFound - 404  msg "User not found"
						 Ok - 200  msg "Password Updated"
	

	[Put] [Admin]
	/api/Admin/User/Role/Password
		Updates a user's password 
	format of AdminUpdatePasswordDto.cs

				Returns:   NotFound - 404  msg "User not found"
					 BadRequest - 400  msg "Something went wrong"
						 Ok - 200  msg "User Deleted"
	

Plants:

	[Get]
	/api/Plants
		Returns all plants belonging to the current user.

				Returns: NotFound - 404
					       Ok - 200  w/ a list of plants (plantID, userID)
					

	[Post]
	/api/Plants
		Creates a new plant for the current logged in user.
		Currently max of 5 per user, changeable in PlantManager.cs: line 14.

				Returns: BadRequest - 400  msg "User does not exist, this really shouldn't happen" --this shouldn't happen btw
					   Conflict - 409  msg "Plant id exists"
					   Conflict - 409  msg "Max Plant Limit Hit"  -- currently set to 5 per user
					    Created - 201  msg ""Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}"


	[Get] [Admin]
	/api/Admin/Plants	
		Returns all plants for all users (plantID, userID)

				Returns: NotFound - 404
					       Ok - 200  w/ a list of plants (plantID, userID) belonging to the user		


	[Get] [Admin]
	/api/Admin/Plants/User/{id}
		Takes in a userID
		Returns all plants belonging to the specific user
				
				Returns: NotFound - 404
					       Ok - 200  w/ a list of plants (plantID, userID) belonging to the user		


	[Post] [Admin]
	api/Admin/Plants
		Creates a new plant for a user
		Takes in a UserID - UserID must exist on database

				Returns:  BadRequest - 400  msg "User does not exist"
					    Conflict - 409  msg "Plant id exists"  -- this shouldn't happen since the plantID is now autogenerated GUID
					    Conflict - 409  msg "Max Plant Limit Hit" --currently set to 5
					     Created - 201  msg "Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}"

		

Sensor Data:
	

	[Get]
        /api/SensorData
       	 Returns all sensor data for all plants owned by the current user

				Returns: BadRequest - 400  msg "User does not exist, this really shouldn't happen" --shouldn't happen 
					   NotFound - 404  msg "No Sensor Data Found"
						 Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
		
	[Get]
	/api/SensorData/{plantID}
		Returns all sensor data for a specific plant 
		Must belong to the current user.

				Returns: BadRequest - 400  msg "User does not exist, this really shouldn't happen" --this also shouldn't happen...
					   NotFound - 404  
						 Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
	
 	[Get]
	/api/SensorData/Daily/{plantID}
        	Returns sensor data for a plantID whose timestampUTC matches the current day
		The plantID must belong to the user.

				
				Returns: BadRequest - 400  msg "User does not exist, this really shouldn't happen" --shouldn't happen...
					   NotFound - 404  
						 Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)

	[Get]
        /api/SensorData/Monthly/{plantID}
		Returns sensor data for a plantID whose timestampUTC matches the current month
		The plantID must belong to the user.
				
				Returns: BadRequest - 400  msg "User does not exist, this really shouldn't happen" --shouldn't happen...
					   NotFound - 404  
						 Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)


	[Post]
	/api/SensorData
        	Creates new sensor data
		input must match the SensorDataModel class
	format of SensorDataModel.cs
					
				Returns: BadRequest - 400
					 BadRequest - 400  msg "User does not exist, this really shouldn't happen" --shouldn't happen...
					   NotFound - 404  msg "Plant ID does not exist"
				  Too Many Requests - 429  msg "Please wait 5 minutes between updates"  -- Currently Disabled - but I put in an arbitrary wait of 5 mins between sensordata updates to stop db from being spammed 
					    Created - 201  msg "added"
					 
	


	[Get] [Admin]
        /api/Admin/SensorData
		Returns ALL sensor data - don't think this is needed? maybe for extra graphs/overall statisics
					
				Returns: NotFound - 404
					       Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
				
	
	[Get] [Admin]
	/api/Admin/SensorData/{plantID}	
		Returns all sensor data for a specific plant
	
				Returns: NotFound - 404
					       Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
				

	[Get] [Admin]
	/api/Admin/SensorData/Daily/{plantID}
		Returns daily sensor data for a specific plant

				Returns: NotFound - 404
					       Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
				

	[Get] [Admin]
	/api/Admin/SensorData/Monthly/{plantID}
		Returns monthly sensor data for a specific plant

				Returns: NotFound - 404
					       Ok - 200  w/ IEnumerable<SensorData>  ((id, plantid, temp, humidity, lightIntensity, moisture, timestampUTC)
				


	[Post] [Admin] [TESTING]
	/api/Admin/ForTesting/SensorData
		Just used this to add sensor data to test daily/monthly 
	format of SensorDataModel.cs

				Returns: BadRequest - 400
					 BadRequest - 400  msg "User does not exist, this really shouldn't happen"
					 BadRequest - 400  msg "Plant ID Does not exist"
				  Too Many Requests - 429  msg "Please wait 5 minutes between updates"  -- Currently Disabled - But I put in an arbitrary wait of 5 mins between sensordata updates to stop db from being spammed - can change if needed
					    Created - 201  msg "added"
				

	
	









ToDo: Data Validation, enforce things such as email format - phone format - etc

email for sending verification: SmartPlantTeam4@gmail.com, thisisagoodpassword, 1-1-2000
