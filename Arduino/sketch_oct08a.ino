
/**
   BasicHTTPSClient.ino
    Created on: 20.08.2018
*/

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h> 
#include <Wire.h>
#include <DHT.h>

#define DHTPIN 1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

float  tempC = 30;
float  humi = 40;
float  light = 40;
float  moisture = 40;
int lightPin = 2;
int moisturePin = 0;
int result;

ESP8266WiFiMulti WiFiMulti;

void setup() {

  Serial.begin(115200);
  Serial.println();

WiFiClient wifi;
  WiFi.begin("WiFi-3C3B", "94576931");


while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print("... Connecting ... ");
}
}

void loop() {
  // wait for WiFi connection
  if ((WiFiMulti.run() == WL_CONNECTED)) {

   std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);

    client->setInsecure();
    // Or, if you happy to ignore the SSL certificate, then use the following line instead:
    // client->setInsecure();

    HTTPClient https;

    Serial.print("[HTTPS] begin...\n");
    if (https.begin(*client, "https://smart-plant.azurewebsites.net/api/SensorData/Token")) {  // HTTPS    

      // Serial.print("[HTTPS] GET...\n");
      // start connection and send HTTP header
      // int httpCode = https.GET();


      String body = getBody();
      Serial.print("[HTTPS] Payload... ");
      Serial.println(body);
      
      // start connection and send HTTP header
      https.addHeader("Content-Type", "application/json");
      int httpCode = https.POST(body);


      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTPS] POST... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }

  Serial.println("Wait 10s before next round...");
  delay(10000);
}

String getBody() {

 
  tempC = 30.123;
  humi = 30.44;
  light = 30.445;
  moisture = 30.46;

 // runFourSensors();
  
  String body = "{\"token\":\"PlantOneTokenZxc123\",\"temp\":" + String(tempC,2) + 
                ",\"humidity\":" + String(humi,3) +
                ",\"lightIntensity\":" + String(light,3) + 
                ",\"moisture\":" + String(moisture,3) + "}\r\n\r\n";
  
  Serial.println("Body = " + body);
  
  return body;
  
}


void runFourSensors() {

 // read humidity
  humi  = dht.readHumidity();
  delay(500);
    
// read temperature as Celsius
  tempC = dht.readTemperature();
  delay(500);
  
// read soil moisture
  moisture = analogRead(moisturePin);
  delay(500);
  
// read light
  light = analogRead(lightPin);
  delay(500);
  
}
