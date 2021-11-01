input.onButtonPressed(Button.A, function () {
    led.plot(0, 4)
    Send_ATCommand("AT+VER=?")
    led.unplot(0, 4)
})
function Send_ATCommand (command: string) {
    RAK_RC = -1
    serial.writeString("" + command + "\r\n")
}
serial.onDataReceived("\r\n", function () {
    led.plot(2, 4)
    rc = serial.readUntil("\n\r")
    if (rc.includes("EVT:")) {
        if (rc.includes("EVT:JOIN FAILED")) {
            lora_joined = 0
        } else if (rc.includes("EVT:JOINED")) {
            lora_joined = 1
        } else {
        	
        }
    } else {
        if (rc.includes("OK")) {
            basic.showIcon(IconNames.Yes)
            RAK_RC = 0
        } else if (rc.includes("AT_ERROR")) {
            basic.showIcon(IconNames.No)
            RAK_RC = 1
        } else {
        	
        }
    }
    led.unplot(2, 4)
})
input.onButtonPressed(Button.AB, function () {
    Send_ATCommand("AT+SEND=2:12345678")
    basic.showIcon(IconNames.SmallDiamond)
})
function LoRa_Join () {
    if (setup_done) {
        Send_ATCommand("AT+JOIN=1:0:10:8")
        basic.pause(5000)
        if (lora_joined == 1) {
            basic.showIcon(IconNames.Fabulous)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }
}
input.onButtonPressed(Button.B, function () {
    led.plot(1, 4)
    if (!(setup_done)) {
        OTAA_Setup("", "", "")
    } else if (!(lora_joined)) {
        LoRa_Join()
    } else {
        basic.showString("LoRa")
    }
    led.unplot(1, 4)
})
function OTAA_Setup (AppEUI: string, DevEUI: string, AppKey: string) {
    setup_running = 1
    while (setup_running) {
        Send_ATCommand("AT+NWM=1")
        basic.pause(500)
        Send_ATCommand("AT+NJM=1")
        basic.pause(500)
        Send_ATCommand("AT+CLASS=A")
        basic.pause(500)
        Send_ATCommand("AT+BAND=4")
        basic.pause(500)
        Send_ATCommand("AT+DEVEUI=" + DevEUI)
        basic.pause(500)
        Send_ATCommand("AT+APPEUI=" + AppEUI)
        basic.pause(500)
        Send_ATCommand("AT+APPKEY=" + AppKey)
        basic.pause(500)
        if (RAK_RC == 0) {
            setup_running = 0
        }
    }
    basic.showIcon(IconNames.Happy)
    Send_ATCommand("ATZ")
    setup_done = 1
}
let setup_running = 0
let rc = ""
let RAK_RC = 0
let lora_joined = 0
let setup_done = 0
let rak_buffer: number[] = []
setup_done = 1
lora_joined = 0
RAK_RC = -1
basic.showIcon(IconNames.Chessboard)
serial.redirect(
SerialPin.P15,
SerialPin.P14,
BaudRate.BaudRate9600
)
basic.clearScreen()
basic.forever(function () {
    led.toggle(0, 0)
    basic.pause(500)
})
