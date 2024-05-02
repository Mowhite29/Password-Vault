#Password Vault v3.0
#
#First design of a tkinter based GUI for the password vault. Built while
# following the GUI module of Edube course aligned with the Python Institute
# PCPP1 professional certification, as a means to practise the content taught
# in the module as well as progressing with this project.
#

import tkinter as tk

class Display:
    def __init__(self, display):
        self.display = display
        display.geometry('1024x640')
        display.resizable(width=False, height=False)
        display.title("Password Vault")

        self.main_menu = tk.Menu(self.display)
        display.config(menu=self.main_menu)
        self.sub_menu_file = tk.Menu(self.main_menu, tearoff=0)
        self.main_menu.add_cascade(label="File", menu=self.sub_menu_file,
                                   underline=0)
        self.sub_menu_file.add_command(label="New Vault", underline=0,
                                       command=self.new_vault)
        self.sub_menu_file.add_separator()
        self.sub_menu_file.add_command(label="Open Vault", underline=0,
                                       command=self.open_vault)
        self.sub_menu_file.add_separator()
        self.sub_menu_file.add_command(label="Quit", accelerator="Ctrl-Q",
                                  underline=0, command=self.are_you_sure)
        self.sub_menu_settings = tk.Menu(self.main_menu, tearoff=0)
        self.main_menu.add_cascade(label="Settings",
                                   menu=self.sub_menu_settings, underline=0)
        self.sub_menu_settings_view = tk.Menu(self.sub_menu_settings, tearoff=0)
        self.sub_menu_settings.add_cascade(label="View", underline=0,
                                      menu=self.sub_menu_settings_view)
        self.sub_menu_settings_view.add_command #TODO View settings
        self.sub_menu_help = tk.Menu(self.main_menu, tearoff=0)
        self.main_menu.add_cascade(label="Help", menu=self.sub_menu_help,
                                   underline=0)
        self.sub_menu_help.add_command(label="How-To", underline=0,
                                       command=self.how_to)
        self.sub_menu_file.add_separator()
        self.sub_menu_help.add_command(label="About", underline=0,
                                       command=self.about)

        self.label_frame_0 = tk.LabelFrame(display, text="Vault Manager",
                                           width=512, height=200)
        self.label_frame_1 = tk.LabelFrame(display, text="Generator", width=512,
                                           height=440)
        self.label_frame_2 = tk.LabelFrame(display, text="Viewer", width=512,
                                           height=440)

        #User enters username and url to generate new password for.
        self.account_label = tk.Label(self.label_frame_1, text="Username used")
        self.account_var = tk.StringVar() 
        self.account_entry = tk.Entry(self.label_frame_1,
                                      textvariable=self.account_var, width=50)
        self.url_label = tk.Label(self.label_frame_1,
                                  text="URL password is used at")
        self.url_var = tk.StringVar()
        self.url_entry = tk.Entry(self.label_frame_1, textvariable=self.url_var,
                                  width=50)

        #Password generator options.
        self.length_label = tk.Label(self.label_frame_1,
                                     text="Enter password length")
        self.length_var = tk.IntVar()
        self.length_entry = tk.Entry(self.label_frame_1,
                                     textvariable=self.length_var, width=10)
        self.upper_case_label = tk.Label(self.label_frame_1,
                                         text="Upper-Case Characters?")
        self.upper_case_var = tk.BooleanVar()
        self.upper_case_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
                                             variable=self.upper_case_var,
                                                  value=True)
        self.upper_case_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
                                             variable=self.upper_case_var,
                                                  value=False)
        self.numbers_label = tk.Label(self.label_frame_1, text="Numbers?")
        self.numbers_var = tk.BooleanVar()
        self.numbers_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
                                          variable=self.numbers_var, value=True)
        self.numbers_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
                                          variable=self.numbers_var, value=False)
        self.symbols_label = tk.Label(self.label_frame_1, text="Symbols?")
        self.symbols_var = tk.BooleanVar()
        self.symbols_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
                                          variable=self.symbols_var, value=True)
        self.symbols_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
                                          variable=self.symbols_var, value=False)
        self.neg_symbols_label = tk.Label(
                            self.label_frame_1,
                            text="If yes to symbols, are any unable to be used?")
        self.neg_symbols_var = tk.StringVar()
        self.neg_symbols_entry = tk.Entry(self.label_frame_1,
                                          textvariable=self.neg_symbols_var)
        self.generate_button = tk.Button(self.label_frame_1, text="Generate",
                                         command=self.new_password)
        #Placement of objects in label frame 1.
        self.account_label.grid(column=0, row=0)
        self.account_entry.grid(column=1, row=0, columnspan=2)
        self.url_label.grid(column=0, row=1)
        self.url_entry.grid(column=1, row=1, columnspan=2)
        self.length_label.grid(column=0, row=3)
        self.length_entry.grid(column=1, row=3)
        self.upper_case_label.grid(column=0, row=4)
        self.upper_case_button_1.grid(column=1, row=4)
        self.upper_case_button_2.grid(column=2, row=4)
        self.numbers_label.grid(column=0, row=5)
        self.numbers_button_1.grid(column=1, row=5)
        self.numbers_button_2.grid(column=2, row=5)
        self.symbols_label.grid(column=0, row=6)
        self.symbols_button_1.grid(column=1, row=6)
        self.symbols_button_2.grid(column=2, row=6)
        self.neg_symbols_label.grid(column=0, row=7)
        self.neg_symbols_entry.grid(column=1, row=7)
        self.generate_button.grid(column=1, row=9)
        #Frames placement
        self.label_frame_0.grid(column=0, row=0, columnspan=2)
        self.label_frame_1.grid(column=0, row=1)
        self.label_frame_2.grid(column=1, row=1)

    def new_vault(self):
        pass

    def open_vault(self):
        pass

    def are_you_sure(self, event=None):
        if messagebox.askyesno("","Are you sure that you want to close the password vault?"):
            window.destroy()

    def how_to(self):
        pass

    def about(self):
        pass

    def new_password(self):
        pass


root= tk.Tk()
output = Display(root)
root.mainloop()


##def new_vault():
##    pass
##
##def open_vault():
##    pass
##
##def are_you_sure(event=None):
##    if messagebox.askyesno("","Are you sure that you want to close the password vault?"):
##        window.destroy()
##
##def how_to():
##    pass
##
##def about():
##    pass
##
##def new_password():
##    pass
    
##display = tk.Tk()
##display.geometry('1024x640')
##display.resizable(width=False, height=False)
##display.title("Password Vault")
###display.icon() #TODO icon.
##
##main_menu = tk.Menu(display)
##display.config(menu=main_menu)
##sub_menu_file = tk.Menu(main_menu, tearoff=0)
##main_menu.add_cascade(label="File", menu=sub_menu_file, underline=0)
##sub_menu_file.add_command(label="New Vault", underline=0, command=new_vault)
##sub_menu_file.add_separator()
##sub_menu_file.add_command(label="Open Vault", underline=0, command=open_vault)
##sub_menu_file.add_separator()
##sub_menu_file.add_command(label="Quit", accelerator="Ctrl-Q", underline=0,
##                          command=are_you_sure)
##sub_menu_settings = tk.Menu(main_menu, tearoff=0)
##main_menu.add_cascade(label="Settings", menu=sub_menu_settings, underline=0)
##sub_menu_settings_view = tk.Menu(sub_menu_settings, tearoff=0)
##sub_menu_settings.add_cascade(label="View", underline=0,
##                              menu=sub_menu_settings_view)
##sub_menu_settings_view.add_command #TODO View settings
##sub_menu_help = tk.Menu(main_menu, tearoff=0)
##main_menu.add_cascade(label="Help", menu=sub_menu_help, underline=0)
##sub_menu_help.add_command(label="How-To", underline=0, command=how_to)
##sub_menu_file.add_separator()
##sub_menu_help.add_command(label="About", underline=0, command=about)
###Settings>>Account>[subwindow to change account settings: email address memory,
###          default password variables, etc
##label_frame_0 = tk.LabelFrame(display, text="Vault Manager", width=512, height=200)
##label_frame_1 = tk.LabelFrame(display, text="Generator", width=512, height=440)
##label_frame_2 = tk.LabelFrame(display, text="Viewer", width=512, height=440)
#User enters username and url to generate new password for.
##account_label = tk.Label(label_frame_1, text="Username used")
##account_var = tk.StringVar() 
##account_entry = tk.Entry(label_frame_1, textvariable=account_var, width=50)
##url_label = tk.Label(label_frame_1, text="URL password is used at")
##url_var = tk.StringVar()
##url_entry = tk.Entry(label_frame_1, textvariable=url_var, width=50)
###Password generator options.
##length_label = tk.Label(label_frame_1, text="Enter password length")
##length_var = tk.IntVar()
##length_entry = tk.Entry(label_frame_1, textvariable=length_var, width=10)
##upper_case_label = tk.Label(label_frame_1, text="Upper-Case Characters?")
##upper_case_var = tk.BooleanVar()
##upper_case_button_1 = tk.Radiobutton(label_frame_1, text="Yes",
##                                     variable=upper_case_var, value=True)
##upper_case_button_2 = tk.Radiobutton(label_frame_1, text="No",
##                                     variable=upper_case_var, value=False)
##numbers_label = tk.Label(label_frame_1, text="Numbers?")
##numbers_var = tk.BooleanVar()
##numbers_button_1 = tk.Radiobutton(label_frame_1, text="Yes",
##                                  variable=numbers_var, value=True)
##numbers_button_2 = tk.Radiobutton(label_frame_1, text="No",
##                                  variable=numbers_var, value=False)
##symbols_label = tk.Label(label_frame_1, text="Symbols?")
##symbols_var = tk.BooleanVar()
##symbols_button_1 = tk.Radiobutton(label_frame_1, text="Yes",
##                                  variable=symbols_var, value=True)
##symbols_button_2 = tk.Radiobutton(label_frame_1, text="No",
##                                  variable=symbols_var, value=False)
##neg_symbols_label = tk.Label(
##    label_frame_1, text="If yes to symbols, are any unable to be used?")
##neg_symbols_var = tk.StringVar()
##neg_symbols_entry = tk.Entry(label_frame_1, textvariable=neg_symbols_var)
##generate_button = tk.Button(label_frame_1, text="Generate", command=new_password)
###Placement of objects in label frame 1.
##account_label.grid(column=0, row=0)
##account_entry.grid(column=1, row=0, columnspan=2)
##url_label.grid(column=0, row=1)
##url_entry.grid(column=1, row=1, columnspan=2)
##length_label.grid(column=0, row=3)
##length_entry.grid(column=1, row=3)
##upper_case_label.grid(column=0, row=4)
##upper_case_button_1.grid(column=1, row=4)
##upper_case_button_2.grid(column=2, row=4)
##numbers_label.grid(column=0, row=5)
##numbers_button_1.grid(column=1, row=5)
##numbers_button_2.grid(column=2, row=5)
##symbols_label.grid(column=0, row=6)
##symbols_button_1.grid(column=1, row=6)
##symbols_button_2.grid(column=2, row=6)
##neg_symbols_label.grid(column=0, row=7)
##neg_symbols_entry.grid(column=1, row=7)
##generate_button.grid(column=1, row=9)
###Frames placement
##label_frame_0.grid(column=0, row=0, columnspan=2)
##label_frame_1.grid(column=0, row=1)
##label_frame_2.grid(column=1, row=1)

##display.mainloop()
