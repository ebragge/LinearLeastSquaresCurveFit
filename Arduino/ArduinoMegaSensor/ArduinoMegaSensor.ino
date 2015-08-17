const String ArduinoBoard = "_Mega"; 
const String Temperature = "temp:"; 
const String Humidity = "hum:"; 

const int MIN = 0;
const int MAX = 255;
bool setupdone = false;
byte ArduinoID = 0;
int incomingByte = 0;
int charCount = 0;
char command[10]; // leave space for \0
bool locked = false;
int led = 13;

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    incomingByte = Serial.read();
    

    if ((char)incomingByte != '#') {
      if (charCount > 20) {
        return;
      }
      else {
        command[charCount] = (char)incomingByte;
        charCount++;
      }
    }
    else {
      command[charCount] = '\0';
      charCount = 0;
      String str(command);
      if (strcmp("info", command) == 0) {
        Serial.println("_Mega:0");
        setupdone = true;
      }
      str.toCharArray(command,4);
      Serial.println(command);
      if (strcmp("dim", command) == 0) {
        Serial.println("light dim: " + str);
        
      }
    }
  }
  else if (setupdone)
  {
    Serial.println(Temperature + random(MIN, MAX));
    delay(1000);
  }
}

