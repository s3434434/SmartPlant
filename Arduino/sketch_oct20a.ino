#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <Servo.h> 
#include <Wire.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

float  tempC = 30;
float  humi = 40;
float  light = 40;
float  moisture = 40;
int lightPin = 2;
int moisturePin = 0;

// Content to the WiFi SSID with password
char ssid[] = "WiFi-3C3B";
char pass[] = "94576931";

int status = WL_IDLE_STATUS;
char serverAddress[] = "smart-plant.azurewebsites.net";
int port = 443;

unsigned long lastConnectionTime = 0;           
const unsigned long postingInterval = 2L * 1000L;

WiFiClient wifi;
WiFiSSLClient client;

void setup() {
  Serial.begin(9600);
  dht.begin();
     
   // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }
 
   // attempt to connect to WiFi network:
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 5 seconds for connection:
    delay(5000);
  }

  // you're connected now, so print out the data:
  Serial.println("You're connected to the network");
  printWiFiData();
}

void loop() {
   if (millis() - lastConnectionTime > postingInterval) {
    httpRequest();
  }
}

void printWiFiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP address : ");
  Serial.println(ip);

  Serial.print("Subnet mask: ");
  Serial.println((IPAddress)WiFi.subnetMask());

  Serial.print("Gateway IP : ");
  Serial.println((IPAddress)WiFi.gatewayIP());

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  printMacAddress(mac);
}

void httpRequest() {
   
    client.stop();

    Serial.println("\nStarting connection to server...");

    // get new JSON body with updated sensor information
    String postData = getBody();
    
    if (client.connect(serverAddress,port)) {                     
      Serial.println("connected to Demteter server");

      client.println("POST /api/SensorData/Token HTTP/1.1");
      client.println("Host: smart-plant.azurewebsites.net");
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(postData.length());
      client.println();
      client.print(postData);

      Serial.println("Wait five seconds");
      delay(5000);
    
      lastConnectionTime = millis();

    }  else {

    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}


void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
    if (i > 0) {
      Serial.print(":");
    }
  }
  Serial.println();
}


String getBody() {

  runFourSensors();
  
  String body = "{\"token\":\"3COMLE56BEGGubemV3I9zw==\",\"temp\":" + String(tempC,1) + 
                ",\"humidity\":" + String(humi,1) +
                ",\"lightIntensity\":" + String(light,1) + 
                ",\"moisture\":" + String(moisture,1) + "}\r\n\r\n";
  
  Serial.println("Body = " + body);
  
  return body;
  
}

void runFourSensors() {

 // read humidity
  humi  = dht.readHumidity();
  humi = humi + 1;
  delay(1000);
  
// read temperature as Celsius
  tempC = dht.readTemperature();
  delay(1000);

// read Soil Moisture
  moisture = analogRead(moisturePin);
  moisture = moisture + 1;
//  moisture = (moisture*40/706) + 1;
//  moisture = 100 - (moisture * 100);
//  moisture = map(moisture, 1023, 165, 0, 100);  
  delay(1000);

// read Light Intensity
  light = analogRead(lightPin);
  light = light / 30;
  delay(1000);

  Serial.println("------------------------------");
  Serial.println("-");

    Serial.print("Light intensity: ");
    Serial.println(light);
    Serial.print("Soil moisture: ");
    Serial.println(moisture);
    Serial.print("Humidity: ");
    Serial.print(humi);
    Serial.println("%");
    Serial.print("Temperature: ");
    Serial.print(tempC);
    Serial.println("°C ~ ");

  Serial.println("-");
  Serial.println("------------------------------");

  delay(3000);

}
