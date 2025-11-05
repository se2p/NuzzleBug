![NuzzleBug Logo](logos/nuzzlebug-logo.png)

This repository is a fork of the [scratch-gui](https://github.com/scratchfoundation/scratch-gui).

It contains:
+ NuzzleBug, adding debugging support
+ Interactive tutorial system with LitterBox integration
+ Extensions to support student progress tracking via [ScratchLog](https://github.com/se2p/scratchlog)
+ Block-Based Testing
+ The UI extensions required for the LitterBox+ LLM integration framework
    + LitterBox HTTP API: https://github.com/se2p/LitterBox-Web/
    + LitterBox: https://github.com/se2p/LitterBox


## Description

NuzzleBug is debugger for Scratch. It allows controlling the executions of Scratch programs with classical debugging functionality such as stepping and breakpoints, and it is an omniscient debugger that also allows reverse stepping. NuzzleBug is also an interrogative debugger that enables to ask questions about executions and provides answers explaining the behavior in question.

This also contains the interactive tutorial system with LitterBox integration.

The Block-Based Testing extension is also contained in this repository.


## Requirements

- Node version 20. You can check your node version via `node --version` or install node from https://nodejs.org/en
- Node package manager. `npm` comes bundled with the node installation from https://nodejs.org/en.
- Yarn. You can install yarn using the node package manager via `npm install --global yarn`.


## Running NuzzleBug

- Optional, depending on the used extensions:
    - Before starting, ensure the [ScratchLog](https://github.com/se2p/scratchlog) and
    - the [LitterBox](https://github.com/se2p/LitterBox-Web) base URLs are configured correctly in the `.env` file.

You can start the Scratch GUI by running `yarn install && yarn start`.

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

### NuzzleBug: Debugging Block-Based Programs in Scratch
```
@inproceedings{nuzzlebug24,
  author = {Deiner, Adina and Fraser, Gordon},
  title = {NuzzleBug: Debugging Block-Based Programs in Scratch},
  year = {2024},
  isbn = {9798400702174},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3597503.3623331},
  doi = {10.1145/3597503.3623331},
  booktitle = {Proceedings of the IEEE/ACM 46th International Conference on Software Engineering},
  articleno = {22},
  numpages = {13},
  keywords = {debugging tools, omniscient debugging, interrogative debugging, scratch, computer science education},
  location = {Lisbon, Portugal},
  series = {ICSE '24}
}
```

### Effects of Automated Feedback in Scratch Programming Tutorials
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

### ScratchLog: Live Learning Analytics for Scratch

See also https://github.com/se2p/scratchlog.

```
@inproceedings{10.1145/3587102.3588836,
  author = {Caspari, Laura and Greifenstein, Luisa and Heuer, Ute and Fraser, Gordon},
  title = {ScratchLog: Live Learning Analytics for Scratch},
  year = {2023},
  isbn = {9798400701382},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3587102.3588836},
  doi = {10.1145/3587102.3588836},
  booktitle = {Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1},
  pages = {403–409},
  numpages = {7},
  keywords = {block-based programming, learning analytics, scratch},
  location = {Turku, Finland},
  series = {ITiCSE 2023}
}
```

### A Block-Based Testing Framework for Scratch
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

### LitterBox+: An Extensible Framework for LLM-enhanced Scratch Static Code Analysis

B. Fein, F. Obermüller and G. Fraser, "LitterBox+: An Extensible Framework for LLM-enhanced Scratch Static Code Analysis",
in Proceedings of the 40th IEEE/ACM International Conference on Automated Software Engineering (ASE ’25), Tool Demonstration Track. IEEE,
2025. https://doi.org/TBD ([arXiv:2509.12021](https://arxiv.org/abs/2509.12021))

The accompanying poster is available at https://doi.org/10.5281/zenodo.17532057.
