"""

RAK3172 LoRa Module
GBS St. Gallen, 2021

"""
# % color="#00796b" icon="\uf1eb"
@namespace
class RAK_LoRa:
    serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
    lora_joined = 0
    RAK_RC = eRAK3172_RC.UNKNOWN
    # % blockId="RAK3172_AT_Check"
    # % block="RAK3172 Check AT communication"
    # % advanced=true
    def checkCommunication():
        # Send a proper command
        Send_ATCommand("AT")
    # % blockId="RAK3172_AT_Cmd"
    # % block="RAK3172 AT Command: %command"
    # % advanced=true
    def Send_ATCommand(command: str):
        global RAK_RC
        RAK_RC = eRAK3172_RC.UNKNOWN
        serial.write_string(command + "\r\n")
    # % blockId="RAK3172_Reset"
    # % block="RAK3172 Reset"
    # % advanced=true
    def RAK3172_Reset():
        Send_ATCommand("ATZ")
    # % blockId="RAK3172_NetworkStat"
    # % block="Network Join Status"
    def LoRa_NJS():
        Send_ATCommand("AT+NJS=?")
    # % blockId="RAK3172_NW_Join"
    # % block="LoRa Network Join | Join: %join | On Power-up: %auto_join"
    def LoRa_Join(join: eBool, auto_join: eBool):
        Send_ATCommand("AT+JOIN=" + str(join) + ":" + str(auto_join) + ":10:8")
    # % blockId="LoRa Send"
    # % block="LoRa Send | data %data on channel %chanNum"
    def LoRa_Send(data: str, chanNum: Channels):
        Send_ATCommand("AT+SEND=" + str(chanNum) + ":" + data)
    # % blockId="RAK3172_OTAASetup"
    # % block="LoRa OTAA Setup: AppEUI %AppEUI | DevEUI %DevEUI | AppKey %AppKey"
    def OTAA_Setup(AppEUI: str, DevEUI: str, AppKey: str):
        checkCommunication()
        basic.pause(100)
        Send_ATCommand("AT+NWM=1")
        # Set work mode LoRaWAN
        basic.pause(500)
        Send_ATCommand("AT+NJM=1")
        # Set activation to OTAA
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
        if RAK_RC == eRAK3172_RC.OK:
            basic.show_icon(IconNames.YES)
            RAK3172_Reset()
        else:
            basic.show_icon(IconNames.NO)
    # % blockId="RAK3172_ABPSetup"
    # % block="LoRa ABP Setup: DevAddr %DevAddr| AppKey %AppKey | NwkKey %NwkKey"
    def ABP_Setup(DevAddr: str, AppKey2: str, NwkKey: str):
        checkCommunication()
        basic.pause(100)
        Send_ATCommand("AT+NWM=1")
        # Set work mode LoRaWAN
        basic.pause(500)
        Send_ATCommand("AT+NJM=0")
        # Set activation to ABP
        basic.pause(500)
        setClass("A")
        basic.pause(500)
        setRegion(eBands.EU868)
        basic.pause(500)
        Send_ATCommand("AT+DEVADDR=" + DevAddr)
        basic.pause(500)
        Send_ATCommand("AT+APPSKEY=" + AppKey2)
        basic.pause(500)
        Send_ATCommand("AT+NWKSKEY=" + NwkKey)
        basic.pause(500)
        if RAK_RC == eRAK3172_RC.OK:
            basic.show_icon(IconNames.YES)
            RAK3172_Reset()
        else:
            basic.show_icon(IconNames.NO)
    # % blockId="RAK3172_SetRegion"
    # % block="Set Region: %band"
    def setRegion(band: eBands):
        Send_ATCommand("AT+BAND=" + str(band))
    # % blockId="RAK3172_SetClass"
    # % block="Set Class: %loraClass"
    def setClass(loraClass: str):
        Send_ATCommand("AT+CLASS=" + loraClass)
    # % blockId="RAK3172_SerialRx"
    # % block="Serial Handler"
    # % weight=100 advanced=true
    def RAK3172_SerialHandler():
        global lora_joined, RAK_RC
        rc = "-1"
        rc = serial.read_until("\n\r")
        if rc.includes("EVT:"):
            if rc.includes("EVT:JOIN FAILED"):
                lora_joined = 0
            elif rc.includes("EVT:JOINED"):
                lora_joined = 1
            else:
                pass
        else:
            if rc.includes("OK"):
                RAK_RC = eRAK3172_RC.OK
            elif rc.includes("AT_ERROR"):
                RAK_RC = eRAK3172_RC.AT_ERROR
            else:
                pass
# END