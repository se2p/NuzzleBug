![NuzzleBug Logo](logos/nuzzlebug-logo.png)

NuzzleBug is a fork of the [scratch-gui](https://github.com/scratchfoundation/scratch-gui) adding debugging support.


## Description

NuzzleBug is debugger for Scratch. It allows controlling the executions of Scratch programs with classical debugging functionality such as stepping and breakpoints, and it is an omniscient debugger that also allows reverse stepping. NuzzleBug is also an interrogative debugger that enables to ask questions about executions and provides answers explaining the behavior in question.


## Requirements

- Node version 16, you can check your node version via `node --version` or install node from https://nodejs.org/en
- Node package manager (NPM) version 8, npm comes bundled with the node installation from https://nodejs.org/en. You can downgrade your npm version if necessary via `npm install -g npm@8`
- Yarn version 1.22, you can check your yarn version via `yarn --version` or install yarn using the node package manager
via `npm install --global yarn`
- Typescript version 5, you can check your typescript version via `tsc --version` or install typescript via `npm install typescript --save-dev`

## Running NuzzleBug

You can start *NuzzleBug* by executing the `start.sh` script, which is responsible for installing the required dependencies and opening the NuzzleBug-UI in a browser.


## Contributors

NuzzleBug is developed at the
[Chair of Software Engineering II](https://www.fim.uni-passau.de/lehrstuhl-fuer-software-engineering-ii/) of  the [University of Passau](https://www.uni-passau.de).

Contributors:

Adina Deiner\
Patric Feldmeier\
Gordon Fraser\
Stephan Gramüller\
Sebastian Schweikl\
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

