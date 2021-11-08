// Gib deinen Code hier ein
input.onButtonPressed(Button.A, function () {
    RAK_LoRa.LoRa_Join(eBool.enable, eBool.disable)
})
serial.onDataReceived("\n\r", function () {
    RAK_LoRa.RAK3172_SerialHandler()
})
input.onButtonPressed(Button.AB, function () {
    RAK_LoRa.RAK3172_Reset()
})
input.onButtonPressed(Button.B, function () {
    RAK_LoRa.LoRa_Send("8400", Channels.Two)
})
loops.everyInterval(60000, function () {
    RAK_LoRa.LoRa_Send(convertToText(input.temperature()), Channels.One)
})
basic.forever(function () {
    led.toggle(2, 2)
    basic.pause(500)
})
