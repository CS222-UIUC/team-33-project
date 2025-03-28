#include <Arduino.h>

#did a mini project to underestand how arduino's work
const int ledPin = LED_BUILTIN;  // the number of the LED pin

int ledState = LOW;  

unsigned long previousMillis = 0;  

const long interval = 1000;  // interval at which to blink (milliseconds)

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }

    digitalWrite(ledPin, ledState);
  }
}
