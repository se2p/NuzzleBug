![NuzzleBug Logo](logos/nuzzlebug-logo.png)

This repository is a fork of the [scratch-gui](https://github.com/scratchfoundation/scratch-gui).

It contains:
+ NuzzleBug, adding debugging support
+ Interactive tutorial system with LitterBox integration
+ Block-Based Testing

## Description

NuzzleBug is debugger for Scratch. It allows controlling the executions of Scratch programs with classical debugging functionality such as stepping and breakpoints, and it is an omniscient debugger that also allows reverse stepping. NuzzleBug is also an interrogative debugger that enables to ask questions about executions and provides answers explaining the behavior in question.

This also contains the interactive tutorial system with LitterBox integration.

The Block-Based Testing extension is also contained in this repository.


## Requirements

- Node version 16, you can check your node version via `node --version` or install node from https://nodejs.org/en
- Node package manager (NPM) version 8, npm comes bundled with the node installation from https://nodejs.org/en. You can downgrade your npm version if necessary via `npm install -g npm@8`
- Yarn version 1.22, you can check your yarn version via `yarn --version` or install yarn using the node package manager
via `npm install --global yarn`
- Typescript version 5, you can check your typescript version via `tsc --version` or install typescript via `npm install typescript --save-dev`

## Running NuzzleBug

Before starting, ensure the ScratchLog and the LitterBox base URLs are configured correctly in the .env file.

You can start the scratch gui by running `yarn install && yarn start`.

Then, go to http://localhost:8601/ using your preferred browser to open the scratch-gui.


## Contributors

NuzzleBug is developed at the
[Chair of Software Engineering II](https://www.fim.uni-passau.de/lehrstuhl-fuer-software-engineering-ii/) of  the [University of Passau](https://www.uni-passau.de).

Contributors:

Adina Deiner\
Jonas Elsper\
Benedikt Fein\
Patric Feldmeier\
Gordon Fraser\
Stephan Gramüller\
Fabian Häuslein\
Florian Obermüller\
Sebastian Schweikl\
Siegfried Steckenbiller\
Phil Werli


NuzzleBug is supported by the project FR 2955/3-1 funded by the
"Deutsche Forschungsgemeinschaft".


## References

```
@inproceedings{nuzzlebug24,
  author    = {Adina Deiner and Gordon Fraser},
  title     = {NuzzleBug: Debugging Block-Based Programs in Scratch },
  booktitle = {ACM/IEEE International Conference on Software Engineering (ICSE)},
  publisher = {{IEEE}},
  year      = {2024}
}
```
```
@inproceedings{obermueller2023tutorials,
author = {Oberm\"{u}ller, Florian and Greifenstein, Luisa and Fraser, Gordon},
title = {Effects of Automated Feedback in Scratch Programming Tutorials},
year = {2023},
url = {https://doi.org/10.1145/3587102.3588803},
doi = {10.1145/3587102.3588803},
booktitle = {Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1}
}
```
```
@inproceedings{10.1145/3699538.3699547,
author = {Feldmeier, Patric and Fraser, Gordon and Heuer, Ute and Oberm\"{u}ller, Florian and Steckenbiller, Siegfried},
title = {A Block-Based Testing Framework for Scratch},
year = {2024},
isbn = {9798400710384},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3699538.3699547},
doi = {10.1145/3699538.3699547},
booktitle = {Proceedings of the 24th Koli Calling International Conference on Computing Education Research},
articleno = {1},
numpages = {12},
keywords = {Scratch, Block-based Programming, Automated Testing, Feedback},
series = {Koli Calling '24}
}
```
