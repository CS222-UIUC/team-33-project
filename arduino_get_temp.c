#include <Arduino.h>

#define TEMP_SENSOR_PIN A0  // Define the analog pin for the temperature sensor

void setup() {
    // Initialize the Serial communication at 9600 baud rate
    Serial.begin(9600);
}

void loop() {
    // Read the raw ADC value from the temperature sensor
    int sensorValue = analogRead(TEMP_SENSOR_PIN);
    
    // Convert the ADC value to a voltage (assuming a 5V reference)
    float voltage = sensorValue * (5.0 / 1023.0);
    
    // For an LM35 sensor, 10mV corresponds to 1°C.
    // Therefore, temperature in Celsius is voltage in volts multiplied by 100.
    float temperatureC = voltage * 100.0;
    
    // Print the temperature to the Serial Monitor
    Serial.print("Temperature: ");
    Serial.print(temperatureC);
    Serial.println(" C");
    
    // Wait for 1 second before taking another reading
    delay(1000);
}
