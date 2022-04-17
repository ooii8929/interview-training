import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
    input: './python-editor.js',
    output: {
        file: './python-editor.bundle.js',
        format: 'iife',
    },
    plugins: [nodeResolve()],
};
