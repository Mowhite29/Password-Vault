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
import random

class pass_gen:
    def __init__(self):
        self.__chars = []
        self.__first = ""
        self.__last = ""
    def password(self, length, case=False, num=False, symbols=False, non=False):
        self.__length = int(length)
        self.gen(self.__length, 97, 122)
        if case != False:
            self.gen(self.__length, 65, 90)
        if symbols != False:
            self.gen((self.__length//4), 33, 47)
            self.gen((self.__length//4), 58, 64)
            self.gen((self.__length//4), 91, 96)
            self.gen((self.__length//4), 123, 126)
        if non != False:
            self.__non = list(non)
            for i in range((len(self.__non))-1):
                if self.__non[i] == " ":
                    del(self.__non[i])
            for i in range((len(self.__chars))-1):
                if self.__chars[i] in self.__non:
                    del(self.__chars[i])
        self.out = "".join(random.sample(self.__chars, self.__length))
        return self.out
    def gen(self, num, first, last):
        for i in range(num):
            self.__chars.append(chr(random.randint(first, last)))

length = input("Enter required length: ")
case = input("Upper case letters required? y/n: ")
num = input("Numbers required? y/n: ")
symbols = input("Symbols required? y/n: ")
non = False
if symbols != "n":
    non = input("Enter any symbols not allowed separated by spaces: ")
gen = pass_gen()
print(gen.password(length, case, num, symbols, non))