const users = [
  {
    email: 'user@gmail.com',
    password: '123123',
    name: 'test user',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
  },
  {
    email: 'user2@gmail.com',
    password: '123123',
    name: 'test user2',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
  },
  {
    email: 'user3@gmail.com',
    password: '123123',
    name: 'test user3',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
  },
];

const professions = [
  {
    profession: 'Backend',
  },
  {
    profession: 'Frontend',
  },
  {
    profession: 'Full stack',
  },
  {
    profession: 'SRE',
  },
];

const tutors = [
  {
    email: 'tutor@gmail.com',
    password: '123123',
    name: 'test tutor',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
    experience1: 'experience1',
    experience2: 'experience2',
    experience3: 'experience3',
    introduce: 'introduce',
    profession: 'Backend,SRE',
  },
  {
    email: 'tutor2@gmail.com',
    password: '123123',
    name: 'test tutor2',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
    experience1: 'experience1',
    experience2: 'experience2',
    experience3: 'experience3',
    introduce: 'introduce',
    profession: 'SRE',
  },
  {
    email: 'tutor3@gmail.com',
    password: '123123',
    name: 'test tutor3',
    provider: 'native',
    picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
    experience1: 'experience1',
    experience2: 'experience2',
    experience3: 'experience3',
    introduce: 'introduce',
    profession: 'SRE,Frontend',
  },
];

const tutors_professions = [
  {
    teacher_id: 1,
    profession_id: 1,
  },
  {
    teacher_id: 1,
    profession_id: 4,
  },
  {
    teacher_id: 2,
    profession_id: 4,
  },
  {
    teacher_id: 3,
    profession_id: 4,
  },
  {
    teacher_id: 3,
    profession_id: 2,
  },
];

const tutors_time = [
  {
    t_id: 1,
    available_time: '2022-05-08 01:28:00',
    course_url: '2022-05-08T01:28_1116846338',
    status: 0,
  },
  {
    t_id: 1,
    available_time: '2022-05-08 01:28:00',
    course_url: '2022-05-08T01:28_1116846339',
    status: 0,
  },
  {
    t_id: 2,
    available_time: '2022-05-08 01:28:00',
    course_url: '2022-05-08T01:28_1116846340',
    status: 1,
  },
];

const appointments = [
  {
    user_id: 1,
    tutor_time_id: 1,
    status: 0,
  },
  {
    user_id: 1,
    tutor_time_id: 2,
    status: 0,
  },
];

const questions = [
  {
    title: 'Reverse String',
    description:
      '<p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Write a function that reverses a string. The input string is given as an characters&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">s</code>.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">You must do this by modifying the input characters&nbsp;<a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank" style="color: rgb(96, 125, 139); outline: none; cursor: pointer; transition: border-bottom-color 0.3s ease 0s; touch-action: manipulation; pointer-events: auto; padding-bottom: 1px; border-bottom: 1px solid transparent;">in-place</a>&nbsp;with&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">O(1)</code>&nbsp;extra memory.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">&nbsp;</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 1:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "hello" <span style="font-weight: bolder;">Output:</span> "olleh"</pre><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 2:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "Hannah" <span style="font-weight: bolder;">Output:</span> "hannaH"</pre>',
    javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    \n};',
    python:
      'class Solution(object):\n    def reverseString(self, s):\n        """\n        :type s: List[str]\n        :rtype: None Do not return anything, modify s in-place instead.\n        """\n        ',
    python_answer_command: 'reverseString',
    run_code_question: "'hello'",
    profession: 'backend',
    call_user_answer: 'reverseString',
    test_answer: "'hello'",
    formal_answer: "function reverseString(str) {\n  return str\n    .split('')\n    .reverse()\n    .join('');\n}",
    category: 'Technical Interview',
  },
  {
    title: 'Reverse String2',
    description:
      '<p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Write a function that reverses a string. The input string is given as an characters&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">s</code>.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">You must do this by modifying the input characters&nbsp;<a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank" style="color: rgb(96, 125, 139); outline: none; cursor: pointer; transition: border-bottom-color 0.3s ease 0s; touch-action: manipulation; pointer-events: auto; padding-bottom: 1px; border-bottom: 1px solid transparent;">in-place</a>&nbsp;with&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">O(1)</code>&nbsp;extra memory.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">&nbsp;</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 1:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "hello" <span style="font-weight: bolder;">Output:</span> "olleh"</pre><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 2:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "Hannah" <span style="font-weight: bolder;">Output:</span> "hannaH"</pre>',
    javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    \n};',
    python:
      'class Solution(object):\n    def reverseString(self, s):\n        """\n        :type s: List[str]\n        :rtype: None Do not return anything, modify s in-place instead.\n        """\n        ',
    python_answer_command: 'reverseString',
    run_code_question: "'hello'",
    profession: 'backend',
    call_user_answer: 'reverseString',
    test_answer: "'hello'",
    formal_answer: "function reverseString(str) {\n  return str\n    .split('')\n    .reverse()\n    .join('');\n}",
    category: 'Technical Interview',
  },
  {
    title: 'Reverse String3',
    description:
      '<p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Write a function that reverses a string. The input string is given as an characters&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">s</code>.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">You must do this by modifying the input characters&nbsp;<a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank" style="color: rgb(96, 125, 139); outline: none; cursor: pointer; transition: border-bottom-color 0.3s ease 0s; touch-action: manipulation; pointer-events: auto; padding-bottom: 1px; border-bottom: 1px solid transparent;">in-place</a>&nbsp;with&nbsp;<code style="font-family: monospace; font-size: 13px; color: rgb(84, 110, 122); background-color: rgb(247, 249, 250); padding: 2px 4px; border-radius: 3px;">O(1)</code>&nbsp;extra memory.</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">&nbsp;</p><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 1:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "hello" <span style="font-weight: bolder;">Output:</span> "olleh"</pre><p style="font-size: 14px; margin-bottom: 1em; color: rgb(38, 50, 56); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;"><span style="font-weight: bolder;">Example 2:</span></p><pre style="font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13px; margin-bottom: 1em; background: rgb(247, 249, 250); padding: 10px 15px; color: rgb(38, 50, 56); line-height: 1.6; border-radius: 3px; white-space: pre-wrap;"><span style="font-weight: bolder;">Input:</span> s = "Hannah" <span style="font-weight: bolder;">Output:</span> "hannaH"</pre>',
    javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    \n};',
    python:
      'class Solution(object):\n    def reverseString(self, s):\n        """\n        :type s: List[str]\n        :rtype: None Do not return anything, modify s in-place instead.\n        """\n        ',
    python_answer_command: 'reverseString',
    run_code_question: "'hello'",
    profession: 'backend',
    call_user_answer: 'reverseString',
    test_answer: "'hello'",
    formal_answer: "function reverseString(str) {\n  return str\n    .split('')\n    .reverse()\n    .join('');\n}",
    category: 'Technical Interview',
  },
];

const questions_video = [
  {
    title: '什麼是遞迴？',
    description: '請用30秒介紹遞迴',
    hint_1: '有沒有提到遞迴的本質：把一個大問題分解成小的問題。拿到小問題的解再去構造大問題的解',
    hint_2: '有沒有提到遞迴的經典問題：斐波那契數列或河內塔',
    hint_3: '有沒有闡述自己曾用遞迴解決過什麼問題？',
    profession: 'backend',
  },
  {
    title: '請自我介紹',
    description: '請用30秒自我介紹',
    hint_1: '你的基本資料是否有在10秒內完成，並有記憶點？',
    hint_2: '是否有用過去經驗展示人格特質',
    hint_3: '有沒有提到你對這份工作的嚮往',
    profession: 'backend',
  },
  {
    title: '什麼是JWT TOKEN',
    description: '請用30秒介紹什麼是JWT TOKEN',
    hint_1: '有提到JWT 的主要目的是「 確立資料來源以及可信度 」嗎？',
    hint_2: '有沒有舉例曾經用過的情境',
    hint_3: '有沒有提到跟session適用的情境差異',
    profession: 'backend',
  },
];

module.exports = {
  users,
  professions,
  tutors,
  tutors_professions,
  tutors_time,
  appointments,
  questions,
  questions_video,
};
