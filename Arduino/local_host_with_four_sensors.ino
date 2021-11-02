#include <I2Cdev.h>
#include <SPI.h>
#include <Ethernet.h>
#include <Servo.h> 
#include <Wire.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// defines variables
int lightPin = 2;
int moisturePin = 0;
int val;
long lastTemp;
int result;
float humi;
float tempC;
float moisture;
float light;

// MAC address for the Ethernet shield
byte mac[] = { 0x28, 0xAD, 0xBE, 0xEF, 0xB9, 0xED };

// numeric IP address of local host server:
IPAddress server(192,168,1,126);  

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 1, 123);

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
    dht.begin();  // initialise the temp & humidity sensor
  while (!Serial) {
     // wait for serial port to connect. Needed for native USB port only
  }

  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
  // give the Ethernet shield a second to initialize:

  Serial.println("connecting...");
  delay(2000);
  Serial.println(Ethernet.localIP());

  writeData();

  Serial.println("LM35 Temperature Sensor"); // print some text in Serial Monitor
  Serial.println("with Arduino UNO R3");
}

void loop() {

    checkClient();

}


void checkClient() {

  // if there are incoming bytes available from the server, read them and print them:
  if (client.available()) {
    runFourSensors();
    writeData();     
    checkConnection();  
  }
}


void writeData() {

  // if you get a connection, report back via serial:
  if (result = client.connect(server, 80)) {
    Serial.println();
    Serial.println("connected, about to writeData()");
    
    // Make a HTTP request:
    client.print("GET /project21/add_to_db_plantmanager.php?sensor1=");
    client.print(moisture);
    client.print("&sensor2=");
    client.print(light);
    client.print("&sensor3=");
    client.print(tempC);
    client.print("&sensor4=");
    client.print(humi);

    Serial.print("GET /project21/add_to_db_plantmanager.php?sensor1=");
    Serial.print(moisture);
    Serial.print("&sensor2=");
    Serial.print(light);
    Serial.print("&sensor3=");
    Serial.print(tempC);
    Serial.print("&sensor4=");
    Serial.println(humi);

    client.println(" HTTP/1.1");
    client.println("Host: www.youevenlift.net");
    client.println("Connection: close");
    client.println();
  } else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}



void runFourSensors() {

 // read humidity
  humi  = dht.readHumidity();
// read temperature as Celsius
  tempC = dht.readTemperature();

    Serial.print("Humidity: ");
    Serial.print(humi);
    Serial.print("%");
    Serial.print("  |  "); 
    Serial.print("Temperature: ");
    Serial.print(tempC);
    Serial.println("°C ~ ");
  
  delay(100);
  Serial.print("Moisture Sensor Value:");
  Serial.println(analogRead(moisturePin));
  moisture = analogRead(moisturePin);
  delay(100);
  Serial.print("Light Sensor Value:");
  Serial.println(analogRead(lightPin));
  light = analogRead(lightPin);
  Serial.println("------------------------------");
  Serial.println("");

  delay(5000);
  
  lastTemp = tempC;
}



void checkConnection() {
    // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();

    // do nothing forevermore:
    while (true);
  }
}
