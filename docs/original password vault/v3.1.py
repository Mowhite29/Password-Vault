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
