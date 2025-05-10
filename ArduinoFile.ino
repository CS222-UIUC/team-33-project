#include <DHT.h>
 #define DHTPIN 9
 #define DHTTYPE DHT11
 
 DHT dht(DHTPIN, DHTTYPE);
 
 void setup() {
   Serial.begin(9600);
   Serial.println("DHT11 Sensor Test");
   dht.begin();
 }
 
 void loop() {
   delay(1000);  // Wait 1 seconds between readings
 
   float temperature = dht.readTemperature();
   float humidity = dht.readHumidity();
 
   if (isnan(temperature) ) {
     Serial.println("Error reading from DHT sensor!");
     return;
   }
 
   //Serial.print("T = ");
   Serial.println(temperature, 1);
   //Serial.print(" deg. C, H = ");
   //Serial.print(humidity, 1);
   //Serial.println(" %");
   //delay(2000);
   
 }