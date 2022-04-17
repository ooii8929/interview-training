import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

import { oneDarkTheme } from '@codemirror/theme-one-dark';

const jscode = `print("Hello world! 123")`;
codeNow = jscode;
const evaluateCode = (code) => {
    console.clear();
    try {
        Function(code)(window);
    } catch (err) {
        console.error(err);
    }
};

const textarea = document.querySelector('#codeeditor');

function editorFromTextArea(textarea) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                python(),
                // javascript(),
                oneDarkTheme,
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNow = editor.state.doc.toString();
                        console.log(codeNow);
                        console.log('DO SOMETHING WITH THE NEW CODE');
                        return codeNow;
                    }
                }),
            ],
            doc: jscode,
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
