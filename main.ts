/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2021
 */

//% color="#00796b" icon="\uf1eb"
namespace RAK_LoRa{
    serial.redirect(SerialPin.P15,SerialPin.P14,BaudRate.BaudRate9600)
    export let setup_running = 0
    export let lora_joined = 0
    export let setup_done = 0
    export let RAK_RC = 0

    //% blockId="RAK3172_AT_Cmd"
    //% block="RAK3172 AT Command: %command"
    //% advanced=true
    export function Send_ATCommand(command: string) {
        RAK_RC = -1
        serial.writeString(command + "\r\n")
    }
    
    //% blockId="RAK3172_Reset"
    //% block="RAK3172 Reset"
    //% advanced=true
    export function RAK3172_Reset() {
        Send_ATCommand("ATZ")
    }

    //% blockId="RAK3172_NetworkStat"
    //% block="Network Join Status"
    function LoRa_NJS(){
        Send_ATCommand("AT + NJS=?")
    }
    

    //% blockId="RAK3172_NW_Join"
    //% block="LoRa Network Join | Join: %join | On Power-up: %auto_join"
    export function LoRa_Join(join: eBool, auto_join: eBool) {
        Send_ATCommand("AT+JOIN=" + join + ":" + auto_join + ":10:8")
    }

    //% blockId="LoRa Send"
    //% block="LoRa Send | data %data on port %port"
    export function LoRa_Send(data: string, port: string, ){
        Send_ATCommand("AT+SEND=" + port + ":" + data)
    }

    //% blockId="RAK3172_OTAASetup"
    //% block="LoRa OTAA Setup: AppEUI %AppEUI" | DevEUI %DevEUI | AppKey %AppKey"
    export function OTAA_Setup(AppEUI: string, DevEUI: string, AppKey: string) {
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
        RAK3172_Reset()
        setup_done = 1
    }

    //% blockId="RAK3172_SerialRx"
    //% block="Serial Handler"
    //% weight=100 advanced=true
    export function RAK3172_SerialHandler(){
        let rc = "-1"
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
    }
}

// END
