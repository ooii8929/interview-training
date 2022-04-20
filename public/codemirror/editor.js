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

let languageChoose = language;

// Run codemirror
for (let i = 0; i < allCodeQuestions.length; i++) {
    const textarea = document.querySelector(`#codeeditor-${allCodeQuestions[i]['id']}`);

    codeNow[i] = allCodeQuestions[i][language];

    editorFromTextArea(textarea, language, codeNow[i]);
}

// language choose
let selectLanguageArr = document.querySelectorAll('.language-select');
console.log('selectLanguageArr', selectLanguageArr);

for (let i = 0; i < selectLanguageArr.length; i++) {
    selectLanguageArr[i].addEventListener('change', (e) => {
        language = e.target.value;
        let languageQuestionID = e.target.getAttribute('data-language');

        // filter code questions
        function isCodeLanguage(x) {
            return x.id == languageQuestionID;
        }

        let abc = getAllQuestionsResponse.filter(isCodeLanguage);

        codeNow = abc[0][language];

        console.log('languageQuestionID', languageQuestionID);

        const textarea = document.querySelector(`#codeeditor-${languageQuestionID}`);

        editorFromTextArea(textarea, language, codeNow);
    });
}

// if (textareaOne) {
//     editorFromTextArea(textareaOne, language);
// }

// if (textareaTwo) {
//     editorFromTextAreaTwo(textareaTwo, language);
// }
// if (textareaThree) {
//     editorFromTextAreaThree(textareaThree, language);
// }

function editorFromTextArea(textareaBlockId, languageChoose, codeNow) {
    switch (language) {
        case 'python':
            languageChoose = python();
            break;
        case 'javascript':
            languageChoose = javascript();
            break;
    }
    textareaBlockId.innerHTML = ``;
    // choose language

    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                languageChoose,
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNow = editor.state.doc.toString();
                        return codeNow;
                    }
                }),
            ],
            doc: codeNow,
        }),
        parent: textareaBlockId,
    });

    return editor;
}

function editorFromTextAreaOne(textareaBlockId) {
    let editor = new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        codeNowOne = editor.state.doc.toString();
                        return codeNowOne;
                    }
                }),
            ],
            doc: codeNowOne,
        }),
        parent: textareaBlockId,
    });

    return editor;
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
