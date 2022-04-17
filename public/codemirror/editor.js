import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { Python } from '@codemirror/lang-python';
// import { java } from '@codemirror/lang-java';
// import { cpp } from '@codemirror/lang-cpp';

// import { oneDarkTheme } from '@codemirror/theme-one-dark';

const evaluateCode = (code) => {
    console.clear();
    try {
        Function(code)(window);
    } catch (err) {
        console.error(err);
    }
};

const textarea = document.querySelector('#codeeditor-golang');
const textareaOne = document.querySelector('#codeeditor-one');
const textareaTwo = document.querySelector('#codeeditor-two');
const textareaThree = document.querySelector('#codeeditor-three');

if (textarea) {
    editorFromTextArea(textarea);
}

if (textareaOne) {
    editorFromTextAreaOne(textareaOne, codeNowOne);
}

if (textareaTwo) {
    editorFromTextAreaTwo(textareaTwo, codeNowTwo);
}
if (textareaThree) {
    editorFromTextAreaOne(textareaThree, codeNowThree);
}

function editorFromTextAreaOne(textareaBlockId, codeNowNum) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowNum = editor.state.doc.toString();
                        return codeNowNum;
                    }
                }),
            ],
            doc: codeNowNum,
        }),
        parent: textareaBlockId,
    });

    // textareaJavascript.parentNode.insertBefore(editor.dom, textareaJavascript);

    // if (textareaJavascript.form) {
    //     textareaJavascript.form.addEventListener('submit', () => {
    //         console.log(editor.state.doc.toString());
    //         textareaJavascript.value = editor.state.doc.toString();
    //     });
    // }

    return editor;
}

function editorFromTextAreaTwo(textareaBlockId, codeNowNum) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowNum = editor.state.doc.toString();
                        return codeNowNum;
                    }
                }),
            ],
            doc: codeNowNum,
        }),
        parent: textareaBlockId,
    });

    // textareaJavascript.parentNode.insertBefore(editor.dom, textareaJavascript);

    // if (textareaJavascript.form) {
    //     textareaJavascript.form.addEventListener('submit', () => {
    //         console.log(editor.state.doc.toString());
    //         textareaJavascript.value = editor.state.doc.toString();
    //     });
    // }

    return editor;
}

function editorFromTextArea(textarea) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                // javascript(),
                oneDarkTheme,
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowGolang = editor.state.doc.toString();
                        console.log(codeNowGolang);
                        console.log('DO SOMETHING WITH THE NEW CODE');
                        return codeNowGolang;
                    }
                }),
            ],
            doc: javascriptCode,
        }),
        parent: document.querySelector('#codeeditor'),
    });

    textarea.parentNode.insertBefore(editor.dom, textarea);

    if (textarea.form) {
        textarea.form.addEventListener('submit', () => {
            console.log(editor.state.doc.toString());
            textarea.value = editor.state.doc.toString();
        });
    }

    return editor;
}
