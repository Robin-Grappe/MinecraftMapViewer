import sys

if (len(sys.argv) < 2 or sys.argv[1] == None) :
    exit("There is no file name.")

filename = sys.argv[1]

f_input = open(filename, "r")

# Cities dictionnary (City name : city level)
# 1 : Capital
# 2 : Green City
# 3 : Prefecture
# 4 : Standard city
# 5 : Hamlet
cities = {
    # "Atlantis": 4
    "Brokenly-Woods": 3,
    "Champi-Ville": 4,
    # "Champion-City": 2
    "Ellesdet": 5,
    "Flowerift": 4,
    "Freedom-City": 1,
    "Grilling Island": 4,
    "La Contrée des Kikoos": 5,
    "Lavandia": 5,
    "Modern-City": 3,
    "Nécropolis": 5,
    "Néo Modern": 4,
    "Oasiris": 2,
    "Old-Gulch": 4,
    "Pendore": 3,
    "Polaris": 4,
    "Port-Cubic": 4,
    "Port-Glaçon / Station Gamma": 5,
    # "Rocket Island": 4,
    "Saint Sordache": 5,
    "Shintao": 4,
    "Snow-Hills": 2,
    "South-City": 2,
    "Sprucecliff": 3,
    "Strange Land": 4,
    "Treerama": 3
}

# Parse a line to get the name, x and z
def parse(line) :
    split_line = line.strip().split(' : ')
    name = split_line[0]
    coords = split_line[1]
    split_coords = coords.split(', ')
    x = split_coords[0]
    z = split_coords[1]

    if verif_int(x) and verif_int(z) :
        print(name, x, z, "=> OK")
    return name, x, z

# Verif if x and z are integers
def verif_int(n) :
    try :
        int(n)
    except :
        print("Line " + i + " : \"" + n + "\" is not an integer.")
    return True

# Build an item of the index json output
def build_index_item(name, x, z) :
    item = ''
    if (i > 1) :
        item += ','
    item += '''
    {
        "name": "%s",
        "x": %s,
        "z": %s
    }''' % (name, x, z)
    return item

# Build an item of the city json output
def build_city_item(name, x, z) :
    if (name in cities) :
        item = ''
        if output_cities != '[' :
            item += ''','''
        item += '''
    {
        "name": "%s",
        "x": %s,
        "z": %s,
        "city_level": %s
    }''' % (name, x, z, cities[name])
    else :
        item = ''
    return item

#################################
# MAIN
#################################

output_index = '''['''
output_cities = '''['''

i = 1
for line in f_input.readlines() :
    name, x, z = parse(line)
    output_index += build_index_item(name, x, z)
    output_cities += build_city_item(name, x, z)
    i += 1

output_index += '''
]'''

f_output = open("index.json", "w")
f_output.write(output_index)

print("\nIndex créé avec succès !")

output_cities += '''
]'''

f_output = open("cities.json", "w")
f_output.write(output_cities)

print("\nVilles créé avec succès !")