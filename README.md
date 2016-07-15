### How to use :

Flag the inputs you want enhanced with a **[data-progressive-file-input]** attribute.  
The script will add a **progressive-file-input__input** class to the input and a **progressive-file-input__label** class to the label when the document is ready.
Style your CSS accordingly.

The string template for the multiple files selected goes into a **[data-multiple-files-label]** attribute,
the {n} part will be replaced by the number of files.

When the user select some files, a **progressive-file-input__input--files-selected** class
and a **progressive-file-input__label--files-selected** class are added.

If you ever want to rerun the enabling script, call window.enableProgressiveFileInputs();

[Demo here](http://mynameislau.github.io/progressive-file-inputs)

To build from source : *npm start*
