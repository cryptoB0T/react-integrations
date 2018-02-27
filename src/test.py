#!/usr/bin/python

import sys, getopt, os

import subprocess

def main():

    for fileName in os.listdir(os.getcwd()+'/contracts/'):

        subprocess.Popen(['solc', '--abi', fileName, '--overwrite', '-o', '/abi/'], cwd=os.getcwd()+'/contracts/')

if __name__ == "__main__":

    main()
