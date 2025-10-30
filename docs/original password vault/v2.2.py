#Password Vault v2.2
#
#Change log:
#- Added self.use variable for user inputted use of password;
#- Added password expiry fuctionality. User will now be asked whether password
# should expire, and if yes then how many days the expiry period should be.
#- Timestamp for expiry time/date is saved along with the password;
#- Passwords are now saved in the format
# "password_use password_created expiry_timestamp";
#- Provides confirmation upon creation and recall of passwords;
#- Added basic error handling.
#
#
import random
import os
import datetime
import time

class file:
    def database(self, exist, location, name):
        self.__task = input("Would you like to access a current password or generate a new one? current/new: ")
        self.use = input("What is the password for? ")
        if self.__task == "new":
            self.new_password()
            if exist != "y":
                file_exist = open(name, "x+t")
            else:
                file_exist = open(name, "a+t")
            self.expire = input("Should password expire? y/n:")
            if self.expire == "y":
                self.days = input("Enter expiry period in days: ")
                file_exist.write("\n" + self.use + " " + self.__password + " " + str(self.expiry(self.days)))
            else: 
                self.days = 36500
                file_exist.write("\n" + self.use + " " + self.__password + " " + str(self.expiry(self.days)))
            file_exist.close()
            return "New password saved for " + self.use
        if self.__task == "current":
            if exist == "y":
                file_exist = open(name, "r+t")
            else:
                return "Must have an existing password file in order to look up password"
            return self.current_password(file_exist)
    
    def current_password(self, file_exist):
        self.found = False
        for line in file_exist:
            self.entry = ""
            self.expired = ""
            for char in line:
                if char == " ":
                    break
                else:
                    self.entry += char
            if self.entry == self.use:
                self.found = True
                self.expire = ""
                for char in line:
                    self.expire += char
                    if char == " ":
                        self.expire = ""
                if (float(self.expire) - time.time()) <= 0:
                    self.expired = "Password has expired"
                file_exist.close()
                return line + " " + self.expired
        if self.found == False:
            file_exist.close()
            return "Entry not found"
    
    def new_password(self):
        self.__length = int(input("Enter required length: "))
        self.__case = input("Upper case letters required? y/n: ")
        self.__num = input("Numbers required? y/n: ")
        self.__symbols = input("Symbols required? y/n: ")
        self.__non = False
        if self.__symbols != "n":
            self.__non = input("Enter any symbols not allowed separated by spaces: ")
   
        self.__password = self.password(self.__length, self.__case, self.__num, self.__symbols, self.__non)

    def password(self, length, case, num, symbols, non=False):
        self.__chars = []
        self.__passw = []
        self.__first = ""
        self.__last = ""
        self.gen(length, 97, 122)
        if case != "n":
            self.gen(length, 65, 90)
        if num != "n":
            self.gen(length, 48, 57)
        if symbols != "n":
            self.gen((length//4), 33, 47)
            self.gen((length//4), 58, 64)
            self.gen((length//4), 91, 96)
            self.gen((length//4), 123, 126)
        if non != False:
            self.__non = list(non)
            for i in range((len(self.__non))-1):
                if self.__non[i] == " ":
                    del(self.__non[i])
            self.bad_char(self.__non)
        random.shuffle(self.__chars)
        for i in range(self.__length):
            self.__passw.append(chr(random.choice(self.__chars)))
        self.out = "".join(self.__passw)
        return self.out
 
    def gen(self, num, first, last):
        for i in range(num):
            self.__chars.append(random.randint(first, last))
          
    def bad_char(self, non):
        for i in range((len(self.__chars))-1):
            if self.__chars[i] in non:
                del(self.__chars[i])
             
    def expiry(self, day):
        self.expire = datetime.datetime.now() + datetime.timedelta(days=int(day))
        return datetime.datetime.timestamp(self.expire)
 
exist = input("Do you have an existing password file? y/n ")
location = input("Enter location for password storage file: ")
name = input("Enter file name: ")

gen = file()

print(gen.database(exist, location, name))
