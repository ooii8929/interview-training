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
    console.log('run code question', i);
    const textarea = document.querySelector(`#codeeditor-${allCodeQuestions[i]['id']}`);
    console.log('run code question textarea', textarea);
    // codeNow[i] = allCodeQuestions[i][language];

    editorFromTextArea(textarea, language, allCodeQuestions[i]['id']);
}

// language change
let selectLanguageArr = document.querySelectorAll('.language-select');

for (let i = 0; i < selectLanguageArr.length; i++) {
    selectLanguageArr[i].addEventListener('change', (e) => {
        // get question ID
        choosedQuestionID = e.target.getAttribute('data-language');

        console.log('choosedQuestionID', choosedQuestionID);

        // get text area
        const textarea = document.querySelector(`#codeeditor-${choosedQuestionID}`);

        // get choosed language
        language = e.target.value;

        editorFromTextArea(textarea, language, choosedQuestionID);
    });
}

function editorFromTextArea(textareaBlockId, languageChoose, q_ID) {
    if (!q_ID) {
        // default question id
        q_ID = getQuestionsArr[0]['id'];
        console.log('choosedQuestionID', q_ID);
    }

    switch (language) {
        case 'python':
            languageChoose = python();
            break;
        case 'javascript':
            languageChoose = javascript();
            break;
    }
    textareaBlockId.innerHTML = ``;
    let editor;
    // choose language
    for (let i = 0; i < getQuestionsArr.length; i++) {
        console.log('getQuestionsArr', getQuestionsArr[i]);
        if (getQuestionsArr[i].id == q_ID) {
            editor = new EditorView({
                state: EditorState.create({
                    extensions: [
                        basicSetup,
                        languageChoose,
                        EditorView.updateListener.of((v) => {
                            if (v.docChanged) {
                                getQuestionsArr[i][language] = editor.state.doc.toString();
                                return getQuestionsArr[i][language];
                            }
                        }),
                    ],
                    doc: getQuestionsArr[i][language],
                }),
                parent: textareaBlockId,
            });
            return;
        }
    }

    return editor;
}
