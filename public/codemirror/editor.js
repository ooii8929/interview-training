import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

import { oneDarkTheme } from '@codemirror/theme-one-dark';

const javascriptCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello world! 123")
}`;

const pythonCode = `print('123')`;

codeNowGolang = javascriptCode;
codeNowPython = pythonCode;
const evaluateCode = (code) => {
    console.clear();
    try {
        Function(code)(window);
    } catch (err) {
        console.error(err);
    }
};

const textarea = document.querySelector('#codeeditor-golang');
const textareaPython = document.querySelector('#codeeditor-python');

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

    if (textarea.form)
        textarea.form.addEventListener('submit', () => {
            console.log(editor.state.doc.toString());
            textarea.value = editor.state.doc.toString();
        });

    return editor;
}
editorFromTextArea(textarea);

function editorFromTextAreaUsePython(textareaPython) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                python(),
                // javascript(),
                oneDarkTheme,
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowPython = editor.state.doc.toString();
                        console.log(codeNowPython);
                        console.log('DO SOMETHING WITH THE NEW CODE');
                        return codeNowPython;
                    }
                }),
            ],
            doc: pythonCode,
        }),
        parent: document.querySelector('#codeeditor-python'),
    });

    textarea.parentNode.insertBefore(editor.dom, textareaPython);

    if (textarea.form)
        textarea.form.addEventListener('submit', () => {
            console.log(editor.state.doc.toString());
            textarea.value = editor.state.doc.toString();
        });

    return editor;
}
editorFromTextAreaUsePython(textareaPython);
