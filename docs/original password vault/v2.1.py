#Password Vault v2.1
#
#Building on the generator designed in v1, I have now added the barebones of
# using a file to store new password in and recall existing ones from.
#Functionality is very limited, syntax is bad, PEP 8 not followed (I did not
# know it existed at the time).

import random
import os

class file:
    def database(self, exist, location, name):
        if exist != "y":
            file_exist = open(name, "x+t")
        else:
            file_exist = open(name, "a+t")
        task = input("Would you like to access a current password or generate a new one? current/new ")
        use = input("What is the password for? ")
        if task == "new":
            self.new_password()
            file_exist.write("\n" + use + " " + self.__password)
            file_exist.close()
        if task == "current":
            for line in file_exist:
                if use in line:
                    return line
               
    def new_password(self):
        self.__length = int(input("Enter required length: "))
        self.__case = input("Upper case letters required? y/n: ")
        self.__num = input("Numbers required? y/n: ")
        self.__symbols = input("Symbols required? y/n: ")
        self.__non = False
        if self.__symbols != "n":
            self.__non = input("Enter any symbols not allowed separated by spaces: ")
       
        self.__password = self.password(self.__length, self.__case, self.__num, self.__symbols, self.__non)
   
    def password(self, length, case=False, num=False, symbols=False, non=False):
        self.__chars = []
        self.__passw = []
        self.__first = ""
        self.__last = ""
        self.gen(length, 97, 122)
        if case != False:
            self.gen(length, 65, 90)
        if num != False:
            self.gen(length, 48, 57)
        if symbols != False:
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
 
exist = input("Do you have an existing password file? y/n ")
location = input("Enter location for password storage file: ")
name = input("Enter file name: ")

gen = file()

print(gen.database(exist, location, name))
