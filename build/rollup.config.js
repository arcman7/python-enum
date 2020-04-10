import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6

export default {
    input: 'src/index.js', // Path relative to package.json
    output: {
        name: 'Enum',
        exports: 'named',
        format: 'cjs'
    },
    plugins: [
        commonjs(),
    ],
};