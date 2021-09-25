#include <Arduino.h>
#include <I2Cdev.h>
#include <SPI.h>
#include <Ethernet.h>
#include <Servo.h> 
#include <Wire.h>

// defines variables
int val;
long lastTemp;
int tempPin = 1;

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = { 0x28, 0xAD, 0xBE, 0xEF, 0xB9, 0xED };
int result;
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
IPAddress server(192,168,1,126);  // numeric IP for Google (no DNS)
//char server[] = "localhost";    // name address for Google (using DNS)

// Set the static IP address to use if the DHCP fails to assign
//IPAddress ip(192, 168, 1, 177);
IPAddress ip(192, 168, 1, 123);


// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
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

  // if there are incoming bytes available
  // from the server, read them and print them:
  if (client.available()) {

    runSensor();

//if (lastDistance < 100) {
//    if (distance > lastDistance) {
        writeData();     
//    }
//}
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();

    // do nothing forevermore:
    while (true);
  }
}


void writeData() {

  // if you get a connection, report back via serial:
  if (result = client.connect(server, 80)) {
//    Serial.print(result);
    Serial.println();
    Serial.println();
    Serial.println("connected, about to writeData()");
    // Make a HTTP request:
    client.print("GET /project21/add_to_db_plantmanager.php?sensor1=");
    client.print(lastTemp);
//    client.print("&sensor2=");
//    client.print(lastTemp);
    client.println(" HTTP/1.1");
    client.println("Host: www.youevenlift.net");
    client.println("Connection: close");
    client.println();
  } else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}


void runSensor() {

  val = analogRead(tempPin);
  float mv = ( val/1024.0)*5000;
  float cel = mv/10;
  float farh = (cel*9)/5 + 32;
  Serial.print("TEMPRATURE = ");
  Serial.print(cel);
  Serial.print("*C");
  Serial.println();
  delay(2000);
  Serial.println("------------------------------");
  
  lastTemp = cel;
}