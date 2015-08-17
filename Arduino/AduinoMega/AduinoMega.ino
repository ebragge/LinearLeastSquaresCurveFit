const String ArduinoBoard = "Mega"; 

const int SERIAL_SPEED = 9600;
const int ANALOG = 512;
const int MAX_COMMAND_SIZE = 20;

const byte analogInCount = 8;
const byte pinCount = 8; 
const byte pins[] = { 3, 4, 5, 6, 7, 8, 9, 10 };

const byte NOLIGHT = 0;
const byte GREEN = 12;
const byte YELLOW = 11;
const byte RED = 2;

const char* INFO = "INFO:";
const char* DEBUG = "DEBUG:";

byte ArduinoID = 0;

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
    String buf(DimCommand);
    
    int loc1 = buf.indexOf(';');
    if ( loc1 < 1 || loc1 == (buf.length()-1) ) return;
    
    int loc2 = buf.indexOf(',');
    if ( loc2 < 1 || loc2 == (buf.length()-1) ) return;
    
    if ( loc1 > loc2-1 ) return;
    
    String id = buf.substring(0,loc1);
    String pp = buf.substring(loc1+1,loc2);
    String vv = buf.substring(loc2+1,buf.length());

    loc1 = vv.indexOf(':');
    if ( loc1 > 0 ) {
        String threshold = vv.substring(loc1+1,vv.length());
        vv = vv.substring(0,loc1);
        Serial.println(threshold);
    }  
     
    if ( id.toInt() != ArduinoID ) return;
    
    int p = pp.toInt();
    int v = vv.toInt();
    if ( p<1 || p>pinCount ) return;
    if ( v<0 || v>255 ) return;
    
    Serial.println(v);
    Serial.println(p);
    analogWrite(pins[p-1], 255-v); // inverse value  
}

void setupTimers(int t0=3 /*DEF*/, int t1=3 /*DEF*/, int t2=4 /*DEF*/, int t3=3 /*DEF*/, int t4=3 /*DEF*/,int t5=3 /*DEF*/) {
// TIMER 0 (Pin 4, 13)
// Value	Divisor	Frequency
// 0×01		1	62.5035 KHz
// 0×02		8	7.8125 KHz
// 0×03		64	976.5 Hz // default
// 0×04		256	244.1 Hz
// 0×05		1024	61.0 Hz
    TCCR0B = (TCCR0B & 0xF8) | t0;

// TIMER 1 (Pin 11, 12)
// Value	Divisor	Frequency
// 0×01		1	31.374 KHz
// 0×02		8	3.921 KHz
// 0×03		64	490.1 Hz // default
// 0×04		256	122.5 Hz
// 0×05		1024	30.63 Hz
    TCCR1B = (TCCR1B & 0xF8) | t1;

// TIMER 2 (Pin 9, 10)
// Value	Divisor	Frequency
// 0×01         1	31.374 KHz
// 0×02		8	3.921 KHz
// 0×03		32	980.3 Hz
// 0×04		64	490.1 Hz // default
// 0×05		128	245 hz
// 0×06		256	122.5 hz
// 0×07		1024	30.63 hz
    TCCR2B = (TCCR2B & 0xF8) | t2;

// TIMER 3 (Pin 2, 3, 5)
// Value	Divisor	Frequency
// 0×01		1	31.374 KHz
// 0×02		8	3.921 Khz
// 0×03		64	490.1 Hz // default
// 0×04		256	122.5 Hz
// 0×05		1024	30.63 Hz
    TCCR3B = (TCCR3B & 0xF8) | t3;

//TIMER 4  (Pin 6, 7, 8)
//Value		Divisor	Frequency
//0×01    	1	31.374 KHz
//0×02    	8	3.921 Khz
//0×03    	64	490.1 Hz // default
//0×04    	256	122.5 Hz
//0×05    	1024	30.63 Hz
    TCCR4B = (TCCR4B & 0xF8) | t4;

// TIMER 5	(Pin 44, 45, 46)
// Value	Divisor	Frequency
// 0×01		1	31.374 KHz
// 0×02		8	3.921 Khz
// 0×03		64	490.1 Hz // default
// 0×04		256	122.5 Hz
// 0×05		1024	30.63 Hz
    TCCR5B = (TCCR5B & 0xF8) | t5;
}

void setup() {  
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
  setupTimers();
  
  Serial.begin(SERIAL_SPEED);
  while ( !Serial  ) {}
}

void loop() {
  if (Serial.available()) {
    setLight(YELLOW);
    incomingByte = Serial.read();
    Serial.println(incomingByte);

    if ((char)incomingByte != '#') {
      if (charCount > MAX_COMMAND_SIZE) {
        charCount=0;
        Serial.println("MAX");
        return;
      }
      else {
        command[charCount] = (char)incomingByte;
        charCount++;
        Serial.println("Added");
      }
    }
    else {
      Serial.println("HANDLING");
      Serial.println(command);
      command[charCount] = '\0';
      charCount = 0;
      String str(command);

      // INFO command handling
      if (strcmp("INFO", command) == 0) {
        String ID;
        ID.concat(ArduinoID);
        Serial.println(INFO + ArduinoBoard + ":" + ID);
      }
      else {

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
  }
  else {
    setLight(GREEN);    
    delay(50);
  }
}

