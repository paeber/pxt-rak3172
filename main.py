def on_button_pressed_a():
    led.plot(0, 4)
    Send_ATCommand("AT+VER=?")
    led.unplot(0, 4)
input.on_button_pressed(Button.A, on_button_pressed_a)

def Send_ATCommand(command: str):
    serial.write_string("" + command + "\r\n")

def on_button_pressed_b():
    led.plot(1, 4)
    USB_Out()
    led.unplot(1, 4)
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_data_received():
    led.plot(4, 4)
    led.unplot(4, 4)
    

def USB_Out():
    serial.redirect_to_usb()
    basic.pause(100)
    serial.write_line("" + str((rak_buffer.remove_at(0))))
    basic.pause(100)
    serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
rak_buffer: List[number] = []
rak_buffer = []
basic.show_icon(IconNames.CHESSBOARD)
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
basic.clear_screen()

serial.on_data_received("\r\n", on_data_received)

def on_forever():
    led.toggle(0, 0)
    basic.pause(100)
    
basic.forever(on_forever)
