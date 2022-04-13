from argparse import ArgumentParser
from management.reusing.github import download_from_github
from management.reusing.file_functions import replace_in_file
from os import remove

parser=ArgumentParser()
parser.add_argument('--local', help='Parses files without download', action="store_true", default=False)
args=parser.parse_args()      

if args.local==False:
    download_from_github("turulomio", "reusingcode", "python/github.py", "management/reusing")
    download_from_github("turulomio", "reusingcode", "python/file_functions.py", "management/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/btnLogIn.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/btnLogOut.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/ChartPie.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/DisplayValues.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/MyDateTimePicker.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/MyMenuInline.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/SwitchLanguages.vue", "src/components/reusing")

replace_in_file("src/components/reusing/SwitchLanguages.vue", "../assets/", "../../assets/")
replace_in_file("src/components/reusing/btnLogOut.vue", "../functions.js", "../../functions.js")