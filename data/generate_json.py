import sys
import math

from cities import cities as cities_data
from regions import regions as regions_count

if (len(sys.argv) < 2 or sys.argv[1] == None) :
    exit("There is no file name.")

filename = sys.argv[1]
f_input = open(filename, "r")
filelen = len(f_input.readlines())
f_input.seek(0)

all_x = []
all_z = []

print("Parsing du fichier \"" + filename + "\"...\n")

#################################
# FUNCTIONS
#################################

# Parse a line to get the name, x and z
def parse(line) :
    split_line = line.strip().split(' : ')
    names = split_line[0]
    split_names = names.split(', ')
    name = split_names[0]
    regions = split_names[1]
    coords = split_line[1]
    split_coords = coords.split(', ')
    x = split_coords[0]
    z = split_coords[1]

    if verif_int(x) and verif_int(z) :
        print(math.ceil(i * 100 / filelen), "%\t", name, "=> OK")
    return name, regions, x, z

# Verif if x and z are integers
def verif_int(n) :
    try :
        int(n)
    except :
        print("Line " + i + " : \"" + n + "\" is not an integer.")
    return True

# Build an item of the index json output
def build_item(name, regions, x, z) :
    item = ''
    if (i > 1) :
        item += ','
    item += '''
    {
        "name": "%s",
        "x": %s,
        "z": %s,''' % (name, x, z)
    if (name in cities_data) :
        item += '''
        "city": %s,''' % (cities_data[name])
    item += '''
        "regions": ['''
    r = 0
    for region in regions.split(' / ') :
        if r > 0 :
            item += ', '
        item += '"' + region + '"'
        if region in regions_count :
            regions_count[region] += 1
        r += 1
    item += ''']
    }'''
    return item

def avg(array) :
    return sum(array) / len(array)

def printStats() :
    print("- - - - - - - - - - - - - - - - - - - - -\n")
    total = i - 1
    for region_cnt in regions_count :
        cnt = regions_count[region_cnt]
        percent = math.ceil(cnt * 100 / total)
        print(region_cnt, ": \t", cnt, "lieux\t (~" + str(percent) + " %)")
    print("--------------------\nTOTAL :", total, "lieux\n")

    print("Coordonnées moyennes : [", math.ceil(avg(all_x)), ",", math.ceil(avg(all_z)), "]")

#################################
# MAIN
#################################

output = '''['''

i = 1
for line in f_input.readlines() :
    name, regions, x, z = parse(line)
    all_x.append(int(x))
    all_z.append(int(z))
    output += build_item(name, regions, x, z)
    i += 1

output += '''
]'''

f_output = open("index.json", "w")
f_output.write(output)

print("\nIndex créé avec succès !\n")

printStats()