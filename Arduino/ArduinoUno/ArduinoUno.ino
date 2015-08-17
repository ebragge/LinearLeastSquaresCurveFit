const String ArduinoBoard = "Uno"; 

const int SERIAL_SPEED = 9600;
const int ANALOG = 512;
const int MAX_COMMAND_SIZE = 20;

const byte analogInCount = 6;
const byte pinCount = 4; 
const byte pins[] = { 3, 5, 9, 11 };

const byte NOLIGHT = 0;
const byte GREEN = 12;
const byte YELLOW = 10;
const byte RED = 2;

byte ArduinoID = 0;

const char* INFO = "INFO:";
const char* DEBUG = "DEBUG:";

String DimCommand = "";
int incomingByte = 0;
int charCount = 0;
char command[MAX_COMMAND_SIZE]; // leave space for \0


void setLight(byte color) {
   digitalWrite(RED, LOW);
   digitalWrite(YELLOW, LOW);
   digitalWrite(GREEN, LOW);
   
   if ( color == YELLOW ) digitalWrite(YELLOW, HIGH);
   else if ( color == GREEN ) digitalWrite(GREEN, HIGH);
   else if ( color == RED ) digitalWrite(RED, HIGH);
}

void handleDimCommand() {
    String tmp(DimCommand);
//    int loc = tmp.indexOf('\r');
//    if ( loc < 0 ) return;
//    if ( loc == tmp.length()-1 ) DimCommand = "";
//    if ( loc < tmp.length()-1 ) DimCommand = tmp.substring(loc+1);
    String buf(DimCommand);// = tmp.substring(0,loc);
    
    int loc1 = buf.indexOf(';');
    if ( loc1 < 1 || loc1 == (buf.length()-1) ) return;
    
    int loc2 = buf.indexOf(',');
    if ( loc2 < 1 || loc2 == (buf.length()-1) ) return;
    
    if ( loc1 > loc2-1 ) return;
    
    String id = buf.substring(0,loc1);
    String pp = buf.substring(loc1+1,loc2);
    String vv = buf.substring(loc2+1,buf.length());
     
    if ( id.toInt() != ArduinoID ) return;
    
    int p = pp.toInt();
    int v = vv.toInt();
    if ( p<1 || p>pinCount ) return;
    if ( v<0 || v>255 ) return;
    
    Serial.println(v);
    Serial.println(p);
    analogWrite(pins[p-1], 255-v); // inverse value  
}

void setup() {
  Serial.begin(SERIAL_SPEED);
  while ( !Serial  ) {}
  
  for ( byte i=0; i<analogInCount; i++ )
  {
    if ( analogRead(i) > ANALOG ) 
    {
      ArduinoID = i;
      break;
    }
  }
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  
  for ( byte i=0; i<pinCount; i++ )
  {
    pinMode(pins[i],OUTPUT);  
  }
}

void loop() {
  if (Serial.available()) {
    setLight(YELLOW);
    incomingByte = Serial.read();

    if ((char)incomingByte != '#') {
      if (charCount > MAX_COMMAND_SIZE) {
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

      // INFO command handling
      if (strcmp("INFO", command) == 0) {
        String ID;
        ID.concat(ArduinoID);
        Serial.println(INFO + ArduinoBoard + ":" + ID);
      }

      // DIM command handling
      str.toCharArray(command,4);
      if (strcmp("DIM", command) == 0) {
        setLight(RED);
        DimCommand = str.substring(3);
        Serial.println(DEBUG + str);
        handleDimCommand();
        delay(50);
      }
    }
  }
  else {
    setLight(GREEN);    
    delay(50);
  }
}

