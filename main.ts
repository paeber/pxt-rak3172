/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2021
 */

//% color="#00796b" icon="\uf1eb"
namespace RAK_LoRa{
    serial.redirect(SerialPin.P15,SerialPin.P14,BaudRate.BaudRate9600)
    export let lora_joined = 0
    export let RAK_RC = eRAK3172_RC.UNKNOWN

    //% blockId="RAK3172_AT_Check"
    //% block="RAK3172 Check AT communication"
    //% advanced=true
    export function checkCommunication() {
        // Send a proper command
        Send_ATCommand("AT")
    }

    //% blockId="RAK3172_AT_Cmd"
    //% block="RAK3172 AT Command: %command"
    //% advanced=true
    export function Send_ATCommand(command: string) {
        RAK_RC = eRAK3172_RC.UNKNOWN
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
        Send_ATCommand("AT+NJS=?")
    }
    

    //% blockId="RAK3172_NW_Join"
    //% block="LoRa Network Join | Join: %join | On Power-up: %auto_join"
    export function LoRa_Join(join: eBool, auto_join: eBool) {
        Send_ATCommand("AT+JOIN=" + join + ":" + auto_join + ":10:8")
    }

    //% blockId="LoRa Send"
    //% block="LoRa Send | data %data on channel %chanNum"
    export function LoRa_Send(data: string, chanNum: Channels, ){
        Send_ATCommand("AT+SEND=" + chanNum + ":" + data)
    }

    //% blockId="RAK3172_OTAASetup"
    //% block="LoRa OTAA Setup: AppEUI %AppEUI | DevEUI %DevEUI | AppKey %AppKey"
    export function OTAA_Setup(AppEUI: string, DevEUI: string, AppKey: string) {
        checkCommunication()
        basic.pause(100)

        Send_ATCommand("AT+NWM=1")      //Set work mode LoRaWAN
        basic.pause(500)
        Send_ATCommand("AT+NJM=1")      //Set activation to OTAA
        basic.pause(500)
        setClass("A")    
        basic.pause(500)
        setRegion(eBands.EU868)
        basic.pause(500)
        Send_ATCommand("AT+DEVEUI=" + DevEUI)
        basic.pause(500)
        Send_ATCommand("AT+APPEUI=" + AppEUI)
        basic.pause(500)
        Send_ATCommand("AT+APPKEY=" + AppKey)
        basic.pause(500)
        if (RAK_RC == eRAK3172_RC.OK) {
            basic.showIcon(IconNames.Yes)
            RAK3172_Reset()
        }
        else {
            basic.showIcon(IconNames.No)
        } 
    }

    //% blockId="RAK3172_ABPSetup"
    //% block="LoRa ABP Setup: DevAddr %DevAddr| AppKey %AppKey | NwkKey %NwkKey"
    export function ABP_Setup(DevAddr: string, AppKey: string, NwkKey: string) {
        checkCommunication()
        basic.pause(100)

        Send_ATCommand("AT+NWM=1")      //Set work mode LoRaWAN
        basic.pause(500)
        Send_ATCommand("AT+NJM=0")      //Set activation to ABP
        basic.pause(500)
        setClass("A")
        basic.pause(500)
        setRegion(eBands.EU868)
        basic.pause(500)
        Send_ATCommand("AT+DEVADDR=" + DevAddr)
        basic.pause(500)
        Send_ATCommand("AT+APPSKEY=" + AppKey)
        basic.pause(500)
        Send_ATCommand("AT+NWKSKEY=" + NwkKey)
        basic.pause(500)
        if (RAK_RC == eRAK3172_RC.OK) {
            basic.showIcon(IconNames.Yes)
            RAK3172_Reset()
        }
        else {
            basic.showIcon(IconNames.No)
        }
    }

    //% blockId="RAK3172_SetRegion"
    //% block="Set Region: %band"
    export function setRegion(band: eBands) {
        Send_ATCommand("AT+BAND=" + band)
    }

    //% blockId="RAK3172_SetClass"
    //% block="Set Class: %loraClass"
    export function setClass(loraClass: string) {
        Send_ATCommand("AT+CLASS=" + loraClass)
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
                RAK_RC = eRAK3172_RC.OK
            } else if (rc.includes("AT_ERROR")) {
                RAK_RC = eRAK3172_RC.AT_ERROR
            } else {

            }
        }
    }
}
