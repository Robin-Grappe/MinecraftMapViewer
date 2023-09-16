import sys

if (len(sys.argv) < 2 or sys.argv[1] == None) :
    exit("There is no file name.")

filename = sys.argv[1]

f_input = open(filename, "r")
lines_length = len(f_input.readlines())
f_input.seek(0)

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

# Build an item of the json output
def build_item(name, x, z) :
    item = '''
    {
        "name": "%s",
        "x": %s,
        "z": %s
    }''' % (name, x, z)
    if (i < lines_length) :
        item += ','
    return item

output = '''['''

i = 1
for line in f_input.readlines() :
    name, x, z = parse(line)
    output += build_item(name, x, z)
    i += 1

output += '''
]'''

f_output = open("index.json", "w")
f_output.write(output)

print("\nFichier créé avec succès !")