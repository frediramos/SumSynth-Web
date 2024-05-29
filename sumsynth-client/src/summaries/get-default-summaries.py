from os.path import dirname, realpath
from os.path import join as join_path
import subprocess as sp
import glob
import json
import os
import re

SERVER = join_path(dirname(realpath(__file__)), '..', '..', '..', 'server')
SUMMSYNTH = join_path(SERVER, 'SumSynth')

def update_summsynth():
	retcode = sp.call(['git', 'submodule', 'update', '--init'], cwd=SERVER)
	assert retcode == 0, 'Failed to run: git submodule update --init'

def parse_spec_file(path):
	with open(path, 'r') as fp:
		l = fp.readline()
		fp.seek(0)
		match = re.search(r'fn (\w+)\(', l)
		fname = match.group(1)
		return fname, fp.read()


def gen_spec_dict(path):
	spec_dict = {}
	pattern = join_path(path, '*.in')
	spec_files = glob.glob(pattern)
	for file in sorted(spec_files):
		fname, code = parse_spec_file(file)
		spec_dict[fname] = code
	return spec_dict


def gen_default_dict():
	summaries = {}
	specs_path = join_path(SUMMSYNTH, 'sumsynth', 'specs')
	for spec in ('under', 'over', 'exact'):
		summaries[spec] = gen_spec_dict(join_path(specs_path, spec))
	return summaries


def main():
	update_summsynth()
	default = gen_default_dict()
	with open('summaries.json', 'w') as out:
		json.dump(default, out)

if __name__ == '__main__':
	main()