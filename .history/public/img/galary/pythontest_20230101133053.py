import os
 
# Get the list of all files and directories
path = "barbershop_mall/public/img/galary"
dir_list = os.listdir(path)
 
print("Files and directories in '", path, "' :")
 
# prints all files
print(dir_list)