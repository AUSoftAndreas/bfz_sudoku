# bfz_sudoku
This repo was just a small school project on the basis of HTML and JS. It solves a sudoku by brute force approach.

Open points:
- Make it possible to define the sudoku to be solved via GUI, instead of hardcoding it
- Right now the solving is done in a seperate worker thread, which did help to make it slow down the browser less. Unfortunately, the GUI updates are delayed, creating a 1,5 GB peak memory usage, that is reached when the worker has solved the sudoku, but the GUI needs to update the view for quite a time after that.
