# newnewman
a cli tool to run multiple newman instances simultaneously. 


## Description
This tool is an util to make u able to run postman collections simultaneously, the result will be stored in report.json in ur work dir.

remember to clean the .newnewman directory after every run, it's gonna grow up very fast.

## Install
```shell
npm install -g newnewman
```


## Postman Data File

use json format for this tool.



## Collection File

This tool is made for postman collection file format v2.1, any other version of collection file is not tested.

## How to Run

```shell
newnewman --path2collection=collection.json --path2data=data.json
```

## How This Tool Work
Essentially, this tool uses [newman](https://github.com/postmanlabs/newman) to run the postman exported collection file. 

It uses a bunch of promises to create the newman run jobs and use Promise.all to run the simultaneously( not accurate).


## Why This Tool
Since all we know that at the moment, postman runner cannot run it's collection simultaneously and seems like it's not gonna support it in the short future, see [https://github.com/postmanlabs/postman-app-support/issues/4198]

## Arguments

- `--path2collection`   path to the postman collection file.
- `--concurrency` how many instances for every individual data item.
- `--save-individual-reports`   set to `YES` to save the newman report for every run.
- `--path2data` path to the data file.

## Issue Raising

raise issues on github, i'll check when i get on github.

Urgent contact: malpower@ymail.com / +86 18080041800




