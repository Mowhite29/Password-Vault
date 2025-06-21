#Password Vault v1
#
#Initial password generator developed. Takes inputs from user of password
# length, inclusion of upper case and numeric characters, inclusion of symbols
# and if so which should be disallowed (to overcome limitations presented by
# some password creation forms).
#
#For each selected option, a sample of random characters is selected to fit the
# length variable provided and added to the master list, self.__chars. Once the
# list has been constructed with all selected options, a sample is again taken
# to produce a string matching the desired password length.
#
#
# import random
#
# class pass_gen:
#     def __init__(self):
#         self.__chars = []
#         self.__first = ""
#         self.__last = ""
#     def password(self, length, case=False, num=False, symbols=False, non=False):
#         self.__length = int(length)
#         self.gen(self.__length, 97, 122)
#         if case != False:
#             self.gen(self.__length, 65, 90)
#         if symbols != False:
#             self.gen((self.__length//4), 33, 47)
#             self.gen((self.__length//4), 58, 64)
#             self.gen((self.__length//4), 91, 96)
#             self.gen((self.__length//4), 123, 126)
#         if non != False:
#             self.__non = list(non)
#             for i in range((len(self.__non))-1):
#                 if self.__non[i] == " ":
#                     del(self.__non[i])
#             for i in range((len(self.__chars))-1):
#                 if self.__chars[i] in self.__non:
#                     del(self.__chars[i])
#         self.out = "".join(random.sample(self.__chars, self.__length))
#         return self.out
#     def gen(self, num, first, last):
#         for i in range(num):
#             self.__chars.append(chr(random.randint(first, last)))
#
# length = input("Enter required length: ")
# case = input("Upper case letters required? y/n: ")
# num = input("Numbers required? y/n: ")
# symbols = input("Symbols required? y/n: ")
# non = False
# if symbols != "n":
#     non = input("Enter any symbols not allowed separated by spaces: ")
# gen = pass_gen()
# print(gen.password(length, case, num, symbols, non))
#
#______________________________________________________________________________
#
#Password Vault v2.1
#
#Building on the generator designed in v1, I have now added the barebones of
# using a file to store new password in and recall existing ones from.
#Functionality is very limited, syntax is bad, PEP 8 not followed (I did not
# know it existed at the time).
#
#
# import random
# import os
#
# class file:
#     def database(self, exist, location, name):
#         if exist != "y":
#             file_exist = open(name, "x+t")
#         else:
#             file_exist = open(name, "a+t")
#         task = input("Would you like to access a current password or generate a new one? current/new ")
#         use = input("What is the password for? ")
#         if task == "new":
#             self.new_password()
#             file_exist.write("\n" + use + " " + self.__password)
#             file_exist.close()
#         if task == "current":
#             for line in file_exist:
#                 if use in line:
#                     return line
#                
#     def new_password(self):
#         self.__length = int(input("Enter required length: "))
#         self.__case = input("Upper case letters required? y/n: ")
#         self.__num = input("Numbers required? y/n: ")
#         self.__symbols = input("Symbols required? y/n: ")
#         self.__non = False
#         if self.__symbols != "n":
#             self.__non = input("Enter any symbols not allowed separated by spaces: ")
#        
#         self.__password = self.password(self.__length, self.__case, self.__num, self.__symbols, self.__non)
#    
#     def password(self, length, case=False, num=False, symbols=False, non=False):
#         self.__chars = []
#         self.__passw = []
#         self.__first = ""
#         self.__last = ""
#         self.gen(length, 97, 122)
#         if case != False:
#             self.gen(length, 65, 90)
#         if num != False:
#             self.gen(length, 48, 57)
#         if symbols != False:
#             self.gen((length//4), 33, 47)
#             self.gen((length//4), 58, 64)
#             self.gen((length//4), 91, 96)
#             self.gen((length//4), 123, 126)
#         if non != False:
#             self.__non = list(non)
#             for i in range((len(self.__non))-1):
#                 if self.__non[i] == " ":
#                     del(self.__non[i])
#             self.bad_char(self.__non)
#         random.shuffle(self.__chars)
#         for i in range(self.__length):
#             self.__passw.append(chr(random.choice(self.__chars)))
#         self.out = "".join(self.__passw)
#         return self.out
#     def gen(self, num, first, last):
#         for i in range(num):
#             self.__chars.append(random.randint(first, last))
#     def bad_char(self, non):
#         for i in range((len(self.__chars))-1):
#             if self.__chars[i] in non:
#                 del(self.__chars[i])
#  
# exist = input("Do you have an existing password file? y/n ")
# location = input("Enter location for password storage file: ")
# name = input("Enter file name: ")
#
# gen = file()
#
# print(gen.database(exist, location, name))
#
#______________________________________________________________________________
#
#Password Vault v2.2
#
#Change log:
#- Added self.use variable for user inputted use of password;
#- Added password expiry fuctionality. User will now be asked whether password
# should expire, and if yes then how many days the expiry period should be.
# Timestamp for expiry time/date is saved along with the password;
#- Passwords are now saved in the format
# "password_use password_created expiry_timestamp";
#- Provides confirmation upon creation and recall of passwords;
#- Added basic error handling.
#
#
# import random
# import os
# import datetime
# import time
#
# class file:
#     def database(self, exist, location, name):
#         self.__task = input("Would you like to access a current password or generate a new one? current/new: ")
#         self.use = input("What is the password for? ")
#         if self.__task == "new":
#             self.new_password()
#             if exist != "y":
#                 file_exist = open(name, "x+t")
#             else:
#                 file_exist = open(name, "a+t")
#             self.expire = input("Should password expire? y/n:")
#             if self.expire == "y":
#                 self.days = input("Enter expiry period in days: ")
#                 file_exist.write("\n" + self.use + " " + self.__password + " " + str(self.expiry(self.days)))
#             else: 
#                 self.days = 36500
#                 file_exist.write("\n" + self.use + " " + self.__password + " " + str(self.expiry(self.days)))
#             file_exist.close()
#             return "New password saved for " + self.use
#         if self.__task == "current":
#             if exist == "y":
#                 file_exist = open(name, "r+t")
#             else:
#                 return "Must have an existing password file in order to look up password"
#             return self.current_password(file_exist)
#     
#     def current_password(self, file_exist):
#         self.found = False
#         for line in file_exist:
#             self.entry = ""
#             self.expired = ""
#             for char in line:
#                 if char == " ":
#                     break
#                 else:
#                     self.entry += char
#             if self.entry == self.use:
#                 self.found = True
#                 self.expire = ""
#                 for char in line:
#                     self.expire += char
#                     if char == " ":
#                         self.expire = ""
#                 if (float(self.expire) - time.time()) <= 0:
#                     self.expired = "Password has expired"
#                 file_exist.close()
#                 return line + " " + self.expired
#         if self.found == False:
#             file_exist.close()
#             return "Entry not found"
#     
#     def new_password(self):
#         self.__length = int(input("Enter required length: "))
#         self.__case = input("Upper case letters required? y/n: ")
#         self.__num = input("Numbers required? y/n: ")
#         self.__symbols = input("Symbols required? y/n: ")
#         self.__non = False
#         if self.__symbols != "n":
#             self.__non = input("Enter any symbols not allowed separated by spaces: ")
#    
#         self.__password = self.password(self.__length, self.__case, self.__num, self.__symbols, self.__non)
#
#     def password(self, length, case, num, symbols, non=False):
#         self.__chars = []
#         self.__passw = []
#         self.__first = ""
#         self.__last = ""
#         self.gen(length, 97, 122)
#         if case != "n":
#             self.gen(length, 65, 90)
#         if num != "n":
#             self.gen(length, 48, 57)
#         if symbols != "n":
#             self.gen((length//4), 33, 47)
#             self.gen((length//4), 58, 64)
#             self.gen((length//4), 91, 96)
#             self.gen((length//4), 123, 126)
#         if non != False:
#             self.__non = list(non)
#             for i in range((len(self.__non))-1):
#                 if self.__non[i] == " ":
#                     del(self.__non[i])
#             self.bad_char(self.__non)
#         random.shuffle(self.__chars)
#         for i in range(self.__length):
#             self.__passw.append(chr(random.choice(self.__chars)))
#         self.out = "".join(self.__passw)
#         return self.out
#  
#     def gen(self, num, first, last):
#         for i in range(num):
#             self.__chars.append(random.randint(first, last))
#           
#     def bad_char(self, non):
#         for i in range((len(self.__chars))-1):
#             if self.__chars[i] in non:
#                 del(self.__chars[i])
#              
#     def expiry(self, day):
#         self.expire = datetime.datetime.now() + datetime.timedelta(days=int(day))
#         return datetime.datetime.timestamp(self.expire)
#  
# exist = input("Do you have an existing password file? y/n ")
# location = input("Enter location for password storage file: ")
# name = input("Enter file name: ")
#
# gen = file()
#
# print(gen.database(exist, location, name))
#
#______________________________________________________________________________
#
#Password Vault v3.0
#
#First design of a tkinter based GUI for the password vault. Built while
# following the GUI module of Edube course aligned with the Python Institute
# PCPP1 professional certification, as a means to practise the content taught
# in the module as well as progressing with this project.
#
#This is my first attempt at using the Object Oriented Programming(OOP)
# approach with tkinter. The file was originally written in the Procedural
# Oriented Programming(POP) style as is taught in the course but I do not
# believe it will be the most effective implementation once I have started
# adding the backend code for the project.
#
#
# import tkinter as tk
#
# class Display:
#     def __init__(self, display):
#         self.display = display
#         display.geometry('1024x640')
#         display.resizable(width=False, height=False)
#         display.title("Password Vault")
#
#         self.main_menu = tk.Menu(self.display)
#         display.config(menu=self.main_menu)
#         self.sub_menu_file = tk.Menu(self.main_menu, tearoff=0)
#         self.main_menu.add_cascade(label="File", menu=self.sub_menu_file,
#                                    underline=0)
#         self.sub_menu_file.add_command(label="New Vault", underline=0,
#                                        command=self.new_vault)
#         self.sub_menu_file.add_separator()
#         self.sub_menu_file.add_command(label="Open Vault", underline=0,
#                                        command=self.open_vault)
#         self.sub_menu_file.add_separator()
#         self.sub_menu_file.add_command(label="Quit", accelerator="Ctrl-Q",
#                                   underline=0, command=self.are_you_sure)
#         self.sub_menu_settings = tk.Menu(self.main_menu, tearoff=0)
#         self.main_menu.add_cascade(label="Settings",
#                                    menu=self.sub_menu_settings, underline=0)
#         self.sub_menu_settings_view = tk.Menu(self.sub_menu_settings, tearoff=0)
#         self.sub_menu_settings.add_cascade(label="View", underline=0,
#                                       menu=self.sub_menu_settings_view)
#         self.sub_menu_settings_view.add_command #TODO View settings
#         self.sub_menu_help = tk.Menu(self.main_menu, tearoff=0)
#         self.main_menu.add_cascade(label="Help", menu=self.sub_menu_help,
#                                    underline=0)
#         self.sub_menu_help.add_command(label="How-To", underline=0,
#                                        command=self.how_to)
#         self.sub_menu_file.add_separator()
#         self.sub_menu_help.add_command(label="About", underline=0,
#                                        command=self.about)
#         self.label_frame_0 = tk.LabelFrame(display, text="Vault Manager",
#                                            width=512, height=200)
#         self.label_frame_1 = tk.LabelFrame(display, text="Generator", width=512,
#                                            height=440)
#         self.label_frame_2 = tk.LabelFrame(display, text="Viewer", width=512,
#                                            height=440)
#
#         #User enters username and url to generate new password for.
#         self.account_label = tk.Label(self.label_frame_1, text="Username used")
#         self.account_var = tk.StringVar() 
#         self.account_entry = tk.Entry(self.label_frame_1,
#                                       textvariable=self.account_var, width=50)
#         self.url_label = tk.Label(self.label_frame_1,
#                                   text="URL password is used at")
#         self.url_var = tk.StringVar()
#         self.url_entry = tk.Entry(self.label_frame_1, textvariable=self.url_var,
#                                   width=50)
#
#         #Password generator options.
#         self.length_label = tk.Label(self.label_frame_1,
#                                      text="Enter password length")
#         self.length_var = tk.IntVar()
#         self.length_entry = tk.Entry(self.label_frame_1,
#                                      textvariable=self.length_var, width=10)
#         self.upper_case_label = tk.Label(self.label_frame_1,
#                                          text="Upper-Case Characters?")
#         self.upper_case_var = tk.BooleanVar()
#         self.upper_case_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
#                                              variable=self.upper_case_var,
#                                                   value=True)
#         self.upper_case_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
#                                              variable=self.upper_case_var,
#                                                   value=False)
#         self.numbers_label = tk.Label(self.label_frame_1, text="Numbers?")
#         self.numbers_var = tk.BooleanVar()
#         self.numbers_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
#                                           variable=self.numbers_var, value=True)
#         self.numbers_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
#                                           variable=self.numbers_var, value=False)
#         self.symbols_label = tk.Label(self.label_frame_1, text="Symbols?")
#         self.symbols_var = tk.BooleanVar()
#         self.symbols_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
#                                           variable=self.symbols_var, value=True)
#         self.symbols_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
#                                           variable=self.symbols_var, value=False)
#         self.neg_symbols_label = tk.Label(
#                             self.label_frame_1,
#                             text="If yes to symbols, are any unable to be used?")
#         self.neg_symbols_var = tk.StringVar()
#         self.neg_symbols_entry = tk.Entry(self.label_frame_1,
#                                           textvariable=self.neg_symbols_var)
#         self.generate_button = tk.Button(self.label_frame_1, text="Generate",
#                                          command=self.new_password)
#         #Placement of objects in label frame 1.
#         self.account_label.grid(column=0, row=0)
#         self.account_entry.grid(column=1, row=0, columnspan=2)
#         self.url_label.grid(column=0, row=1)
#         self.url_entry.grid(column=1, row=1, columnspan=2)
#         self.length_label.grid(column=0, row=3)
#         self.length_entry.grid(column=1, row=3)
#         self.upper_case_label.grid(column=0, row=4)
#         self.upper_case_button_1.grid(column=1, row=4)
#         self.upper_case_button_2.grid(column=2, row=4)
#         self.numbers_label.grid(column=0, row=5)
#         self.numbers_button_1.grid(column=1, row=5)
#         self.numbers_button_2.grid(column=2, row=5)
#         self.symbols_label.grid(column=0, row=6)
#         self.symbols_button_1.grid(column=1, row=6)
#         self.symbols_button_2.grid(column=2, row=6)
#         self.neg_symbols_label.grid(column=0, row=7)
#         self.neg_symbols_entry.grid(column=1, row=7)
#         self.generate_button.grid(column=1, row=9)
#         #Frames placement
#         self.label_frame_0.grid(column=0, row=0, columnspan=2)
#         self.label_frame_1.grid(column=0, row=1)
#         self.label_frame_2.grid(column=1, row=1)
#
#     def new_vault(self):
#         pass
#
#     def open_vault(self):
#         pass
#
#     def are_you_sure(self, event=None):
#         if messagebox.askyesno("","Are you sure that you want to close the password vault?"):
#             window.destroy()
#
#     def how_to(self):
#         pass
#
#     def about(self):
#         pass
#
#     def new_password(self):
#         pass
#
# root= tk.Tk()
# output = Display(root)
# root.mainloop()
#
#______________________________________________________________________________
#
#Password Vault v3.1
#
#Change log:
#-As outlined in PEP 506, use of the random module has been replaced with the
# secrets module as it is more cryptographically sound due to its less
# predicable nature.
#-Redesigned the password generation process to use the String module, the use
# of unicode integer point values in selecting possible values worked but was a
# very crude solution.

import base64
from cryptography.fernet import Fernet
from datetime import datetime
from datetime import timedelta
import time
import tkinter as tk
from tkinter import messagebox
import secrets
import string
    
class Display:
    def __init__(self, display):
        self.display = display
        display.geometry('515x640')
        display.resizable(width=False, height=False)
        display.title("Password Vault")
        #Menu bar.
        self.main_menu = tk.Menu(self.display)
        display.config(menu=self.main_menu)
        self.sub_menu_file = tk.Menu(self.main_menu, tearoff=0)
        self.main_menu.add_cascade(label="File", menu=self.sub_menu_file,
                                    underline=0)
        self.sub_menu_file.add_command(label="New Vault",
            accelerator="Ctrl+N", underline=0, command=self.new_vault_pop_out)
        self.sub_menu_file.add_separator()
        self.sub_menu_file.add_command(label="Open Vault",
            accelerator="Ctrl+O", underline=0, command=self.open_vault_pop_out)
        self.sub_menu_file.add_separator()
        self.sub_menu_file.add_command(label="Quit", accelerator="Ctrl+Q",
                            underline=0, command=lambda : self.are_you_sure())
        self.sub_menu_help = tk.Menu(self.main_menu, tearoff=0)
        self.main_menu.add_cascade(label="Help", menu=self.sub_menu_help,
                                                                underline=0)
        self.sub_menu_help.add_command(label="About", underline=0,
                                                            command=self.about)
        #Label frames
        self.label_frame_0 = tk.LabelFrame(display, text="Vault Manager",
                                        labelanchor='n', width=512, height=200)
        self.label_frame_1 = tk.LabelFrame(display, text="Generator",
                                        labelanchor='n', width=512, height=440)
        self.label_frame_2 = tk.LabelFrame(display, text="Viewer",
                                        labelanchor='n', width=512, height=440)
        #Password manager options
        self.vault_file = tk.StringVar()
        self.vault_entry_label = tk.Label(self.label_frame_0,
                                                text="Enter vault file name")
        self.vault_file_var = tk.StringVar()
        self.vault_entry = tk.Entry(self.label_frame_0,
                                    textvariable=self.vault_file_var, width=20)
        self.vault_open = tk.Button(self.label_frame_0, text="Open Vault",
                command=lambda : self.open_vault(self.vault_file_var.get()))
        self.vault_new = tk.Button(self.label_frame_0, text="Create Vault",
                    command=lambda : self.new_vault(self.vault_file_var.get()))
        self.encryption_key_entry_label = tk.Label(self.label_frame_0,
                                            text="Enter vault encryption key")
        self.encryption_key = tk.StringVar()
        self.encryption_key_entry = tk.Entry(self.label_frame_0,
                                    textvariable=self.encryption_key, width=20)

        #User enters username and url to generate new password for.
        self.url_label = tk.Label(self.label_frame_1,
                        text="URL/Website that password \n is to be used for")
        self.url_var = tk.StringVar()
        self.url_entry = tk.Entry(self.label_frame_1,
                                        textvariable=self.url_var, width=50)
        self.account_label = tk.Label(self.label_frame_1, text="Username used")
        self.account_var = tk.StringVar() 
        self.account_entry = tk.Entry(self.label_frame_1,
                                    textvariable=self.account_var, width=32)
        #Password generator options.
        self.length_label = tk.Label(self.label_frame_1,
                                                text="Enter password length")
        self.length_var = tk.IntVar()
        self.length_entry = tk.Entry(self.label_frame_1,
                                        textvariable=self.length_var, width=10)
        self.upper_case_label = tk.Label(self.label_frame_1,
                                        text="Include upper-case characters?")
        self.upper_case_var = tk.BooleanVar()
        self.upper_case_var.set(True)
        self.upper_case_button_1 = tk.Radiobutton(self.label_frame_1,
                        text="Yes", variable=self.upper_case_var, value=True)
        self.upper_case_button_2 = tk.Radiobutton(self.label_frame_1,
                        text="No", variable=self.upper_case_var, value=False)
        self.numbers_label = tk.Label(self.label_frame_1,
                                        text="Include numbers?")
        self.numbers_var = tk.BooleanVar()
        self.numbers_var.set(True)
        self.numbers_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
                                                    variable=self.numbers_var,
                                                                    value=True)
        self.numbers_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
                                      variable=self.numbers_var, value=False)
        self.symbols_label = tk.Label(self.label_frame_1,
                                                    text="Include symbols?")
        self.symbols_var = tk.BooleanVar()
        self.symbols_var.set(True)
        self.symbols_button_1 = tk.Radiobutton(self.label_frame_1, text="Yes",
                                        variable=self.symbols_var, value=True)
        self.symbols_button_2 = tk.Radiobutton(self.label_frame_1, text="No",
                                        variable=self.symbols_var, value=False)
        self.neg_symbols_label = tk.Label(self.label_frame_1,
                    text="If yes to symbols, \n are any unable to be used?")
        self.neg_symbols_var = tk.StringVar()
        self.neg_symbols_entry = tk.Entry(self.label_frame_1,
                                            textvariable=self.neg_symbols_var)        
        self.expiry_label = tk.Label(self.label_frame_1,
                        text="After how may days \n should password expire?")
        self.expiry_var = tk.IntVar()
        self.expiry_entry = tk.Entry(self.label_frame_1,
                                        textvariable=self.expiry_var, width=10)
        self.generate_button = tk.Button(self.label_frame_1, text="Generate",
                            command=lambda : self.new_password(
                            self.length_var.get(), self.upper_case_var.get(),
                            self.numbers_var.get(), self.symbols_var.get(),
                            self.neg_symbols_var.get(), self.account_var.get(),
                            self.expiry_var.get(), self.vault_file.get(),
                            self.url_var.get()
                                                                            ))
        #Password viewer options.
        self.password_lookup_var = tk.StringVar()
        self.password_lookup_entry = tk.Entry(self.label_frame_2,
                            textvariable=self.password_lookup_var, width=50)
        self.password_lookup_button = tk.Button(self.label_frame_2,
                text="Search", command=lambda : self.retrieve_password(
                                                self.vault_file.get(),
                                                self.password_lookup_var.get()
                                                                            ))
        self.expired_password = tk.BooleanVar()
        self.expired_password_list = tk.StringVar()
        self.expired_password_display = tk.Label(self.label_frame_2,
                textvariable=self.expired_password_list, width=50, height=10)
        #Placement of objects in label frame 0.
        self.vault_entry_label.grid(column=0, row=0)
        self.vault_entry.grid(column=1, row=0)
        self.vault_open.grid(column=2, row=1)
        self.vault_new.grid(column=2, row=0)
        self.encryption_key_entry_label.grid(column=0, row=1)
        self.encryption_key_entry.grid(column=1, row=1)
        #Placement of objects in label frame 1.
        self.url_label.grid(column=0, row=0)
        self.url_entry.grid(column=1, row=0, padx=10)
        self.account_label.grid(column=0, row=1)
        self.account_entry.grid(column=1, row=1)
        self.length_label.grid(column=0, row=3)
        self.length_entry.grid(column=1, row=3)
        self.upper_case_label.grid(column=0, row=4)
        self.upper_case_button_1.grid(column=1, row=4, sticky='w')
        self.upper_case_button_2.grid(column=1, row=4)
        self.numbers_label.grid(column=0, row=5)
        self.numbers_button_1.grid(column=1, row=5, sticky='w')
        self.numbers_button_2.grid(column=1, row=5)
        self.symbols_label.grid(column=0, row=6)
        self.symbols_button_1.grid(column=1, row=6, sticky='w')
        self.symbols_button_2.grid(column=1, row=6)
        self.neg_symbols_label.grid(column=0, row=7)
        self.neg_symbols_entry.grid(column=1, row=7)
        self.expiry_label.grid(column=0, row=8)
        self.expiry_entry.grid(column=1, row=8)
        self.generate_button.grid(column=0, row=9, columnspan=2)        
        #Placement of objects in label frame 2.
        self.password_lookup_entry.grid(column=0, row=0)
        self.password_lookup_button.grid(column=1, row=0, sticky='w')
        self.expired_password_display.grid(column=0, row=1, columnspan=2)        
        #Frames placement.
        self.label_frame_0.grid(column=0, row=0, padx=10)
        self.label_frame_1.grid(column=0, row=1, padx=10)
        self.label_frame_2.grid(column=0, row=2, padx=10)

        display.bind_all("<Control-q>", self.are_you_sure)

    def new_vault(self, vault_name):
        try:
            self.new_vault_window.destroy()
        except:
            pass
        try:
            new_vault = open(vault_name, 'w+b')
            new_vault_content = str(vault_name + "\n")
            new_vault_encrypted = self.encryption(new_vault_content)
            new_vault.write(new_vault_encrypted)
            new_vault.close()
            self.vault_file.set(vault_name)
            messagebox.showinfo("Vault created",
                                "Vault created successfully")
        except FileExistsError:
            messagebox.showerror("Vault already exists",
                                "This Vault file already exists.")
        except FileNotFoundError:
            messagebox.showerror("Vault not found",
                        "Please enter a name for your new vault")
                    
    def new_vault_pop_out(self):
        self.new_vault_window = tk.Toplevel(root)
        self.new_vault_window.title('Create new Vault')
        self.new_vault_window.geometry('200x200')
        self.new_vault_window_label = tk.Label(self.new_vault_window,
                        text="Enter name for new vault").grid(column=1, row=0)
        self.new_vault_window_entry = tk.Entry(self.new_vault_window,
                        textvariable=self.vault_file_var).grid(column=1, row=1)
        self.new_vault_window_button = tk.Button(self.new_vault_window,
                        text="Create Vault", command=lambda : self.new_vault(
                            self.vault_file_var.get())).grid(column=1, row=2)
     
    def open_vault(self, vault_name):
        try:
            self.open_vault_window.destroy()
        except:
            pass
        
        try:
            file_open = open(vault_name, 'rb')
            file_decrypted = self.decryption(file_open.read())
            name_list = []
            for line in file_decrypted.split('\n'):
                word = 0
                self.found_use = ""
                self.found_username = ""
                self.found_password = ""
                self.found_timestamp = ""
                for char in line:
                    if char == " ":
                        word += 1
                    if word == 0:
                        self.found_use += char
                    elif word == 1:
                        self.found_username += char
                    elif word == 2:
                        self.found_password += char
                    elif word == 3:
                        self.found_timestamp += char
                if self.found_timestamp == "":
                    pass
                elif(float(self.found_timestamp) - time.time()) <= 0:
                    self.expired_password.set(True)
                    name_list.append(self.found_use)

                
            name_list = "\n".join(name_list)
            self.expired_password_list.set(
                            "The password/s for the following have expired: \n"
                                            + name_list)
            file_open.close()
            self.vault_file.set(vault_name)
            messagebox.showinfo("Vault opened",
                                        "Password Vault opened successfully")

        except FileNotFoundError:
            messagebox.showerror("Vault not found",
                        "Specified Password Vault file \n could not be found.")
        except AttributeError:
            pass

    def open_vault_pop_out(self):
        self.open_vault_window = tk.Toplevel(root)
        self.open_vault_window.title('Create new Vault')
        self.open_vault_window.geometry('200x200')
        self.open_vault_window_label = tk.Label(self.open_vault_window,
                                text="Enter vault name").grid(column=0, row=0)
        self.open_vault_window_entry = tk.Entry(self.open_vault_window,
                        textvariable=self.vault_file_var).grid(column=0, row=1)
        self.open_vault_window_button = tk.Button(self.open_vault_window,
                    text="Open Vault", command=lambda : self.open_vault(
                            self.vault_file_var.get())).grid(column=0, row=2)

    def are_you_sure(self, event=None):
        if messagebox.askyesno("",
                "Are you sure that you want \n to close the password vault?"):
            root.destroy()

    def about(self):
        self.about_window = tk.Toplevel(root)
        self.about_window.title("About")
        self.about_window.geometry('200x200')
        tk.Label(self.about_window, text="Password Vault by Moses White").grid(
                                                column=0, row=0, sticky='w')
        tk.Label(self.about_window, text="https://github.com/Mowhite29").grid(
                                                column=0, row=1, sticky='w')

    def new_password(self, length, case, num, symbols, disallowed_symbols,
                                        name, day, vault_file, url=None):
        try:
            self.__chars = []
            self.__passw = []
            self.__first = ""
            self.__last = ""
            self.gen(length, string.ascii_lowercase)
            if case:
                self.gen(length, string.ascii_uppercase)
            if num:
                self.gen(length, string.digits)
            if symbols:
                self.gen(length, string.punctuation)
                
            if disallowed_symbols != '':
                disallowed_symbols.replace(' ', '')
                for i in range(len(self.__chars)):
                    if self.__chars [i] in list(disallowed_symbols):
                        del(self.__chars[i])

            self.__chars = ''.join(self.__chars)
            for i in range(length):
                self.__passw.append(secrets.choice(str(self.__chars)))
            self.out = "".join(self.__passw)
            
            if messagebox.askyesno("New Password", "New password is "
                        + self.out + "\n Would you like to save to vault?"):
                file_open = open(vault_file, 'rb')
                file_decrypted = str(self.decryption(file_open.read()))
                file_decrypted += (url.upper() + ' ' + name + ' '
                            + self.out + ' ' + self.expiry(day) + '\n')
                file_encrypted = self.encryption(file_decrypted)
                file_open.close()
                file_open = open(vault_file, 'wb')
                file_open.write(file_encrypted)
                messagebox.showinfo("New password created",
                    "New password has been saved. Encryption key has been "
                                    "updated, remember to take note of it")
                file_open.close()
        except FileNotFoundError:
            messagebox.showerror("Error",
                            "Must open a vault before \n creating a password!")
                           
    def gen(self, num, pool):
        for i in range(num):
            self.__chars.append(secrets.choice(pool))

    def expiry(self, day):
        self.expire = datetime.now() + timedelta(days=int(day))
        return str(datetime.timestamp(self.expire))

    def retrieve_password(self, vault_name, use):
        try:
            self.found = False
            self.expired = False
            file_open = open(vault_name, 'rb')
            file_decrypted = self.decryption(file_open.read())
            for line in file_decrypted.split('\n'):            
                word = 0
                self.found_use = ""
                self.found_username = ""
                self.found_password = ""
                self.found_timestamp = ""
                for char in line:
                    if char == " ":
                        word += 1
                    if word == 0:
                        self.found_use += char
                    elif word == 1:
                        self.found_username += char
                    elif word == 2:
                        self.found_password += char
                    elif word == 3:
                        self.found_timestamp += char
                if self.found_use == use.upper():
                    self.found = True
                    break
            if self.found and (float(self.found_timestamp) - time.time()) <= 0:
                self.expired = True
            if self.found and self.expired == False:
                messagebox.showinfo("Password found", "Username: "
                            + self.found_username + "\n Password: "
                                            + self.found_password)                
            elif self.found and self.expired:
                messagebox.showinfo("Password found", "Username: "
                                + self.found_username + "\n Password: "
                                + self.found_password + "\n Password expired")
            else:
                messagebox.showerror("Password not found",
                                "Password for that use cannot \n be found.")
            file_open.close()
        except FileNotFoundError:
            messagebox.showerror("Error",
                    "Must open a vault before \n searching for a password!")

    def encryption(self, file):
        key = Fernet.generate_key()
        f = Fernet(key)
        key_string = key.decode('utf-8')
        self.encryption_key.set(key_string)
        file_encoded = file.encode('ascii')
        token = f.encrypt(file_encoded)
        token_base64 = base64.b64encode(token)
        return token_base64

    def decryption(self, file):
        try:
            key_string = self.encryption_key.get()
            key = key_string.encode('utf-8')
            f = Fernet(key)
            file_decoded = base64.b64decode(file)
            file_bytes = f.decrypt(file_decoded)
            file_string = file_bytes.decode('ascii')
            return file_string
        except ValueError:
            messagebox.showerror("Error", "Password vault decryption key "
                                 "incorrect")

root= tk.Tk()
output = Display(root)
root.mainloop()
