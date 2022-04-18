import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
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

const textareaTwo = document.querySelector('#codeeditor-two');
const textareaThree = document.querySelector('#codeeditor-three');

if (textareaTwo) {
    editorFromTextAreaTwo(textareaTwo);
}
if (textareaThree) {
    editorFromTextAreaThree(textareaThree);
}

function editorFromTextAreaTwo(textareaBlockId) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowTwo = editor.state.doc.toString();
                        return codeNowTwo;
                    }
                }),
            ],
            doc: codeNowTwo,
        }),
        parent: textareaBlockId,
    });

    return editor;
}

function editorFromTextAreaThree(textareaBlockId) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowThree = editor.state.doc.toString();
                        return codeNowThree;
                    }
                }),
            ],
            doc: codeNowThree,
        }),
        parent: textareaBlockId,
    });

    return editor;
}
