
#include "Arduino_SensorKit.h"
 
void setup() {
  Serial.begin(9600);
  Environment.begin();
}
 
void loop() {
  
  Serial.print("Temperature = ");
  Serial.print(Environment.readTemperature()); //print temperature
  Serial.println(" C");
  Serial.print("Humidity = ");
  Serial.print(Environment.readHumidity()); //print humidity
  Serial.println(" %");
  delay(2000);
  
}
