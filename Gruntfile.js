module.exports = function(grunt) {

    grunt.option('stack', true);

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-baseline");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks('grunt-ts-clean');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: {
                src: [
                    "build/"
                ]
            },
            lib: {
                src: [
                    "lib/**/*.js",
                ]
            }
        },

        typescript: {
            options: {
                target: "es5",
                module: "commonjs",
                sourceMap: false,
                declaration: true,
                noImplicitAny: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true
            },
            build: {
                src: ['src/**/*.ts'],
                dest: 'build/src/'
            },
            tests: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/'
            },
            benchmarks: {
                src: [
                    'benchmarks/**/*.ts'
                ],
                dest: 'build/'
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: [
                            'package.json'
                        ],
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        src: [
                            "src/**/*.d.ts"
                        ],
                        dest: "build/"
                    },
                    {
                        expand: true,
                        src: [
                            "typings/**/*.d.ts"
                        ],
                        dest: "build"
                    }
                ]
            },
            lib: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/src/',
                        src: [
                            '**/*.js',
                            '**/*.d.ts'
                        ],
                        dest: 'lib/'
                    }
                ]
            }
        },

        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec'
                },
                src: ['build/tests/**/*.tests.js']
            }
        },

        baseline: {
            benchmarks: {
                options: {
                    baselinePath: "baseline.json",
                    useColors: true
                },
                src: [
                    "build/benchmarks/**/*.bench.js"
                ]
            }
        },

        ts_clean: {
            lib: {
                options: {
                    verbose: false
                },
                src: ['lib/**/*'],
                dot: false
            }
        }
    });

    // Default task(s).
    grunt.registerTask("default", [ "build", "lib", "tests" ]);
    grunt.registerTask("build", [ "clean:build", "typescript:build", "copy:build", "typescript:benchmarks" ]);
    grunt.registerTask("lib", [ "clean:lib", "copy:lib", "ts_clean:lib" ]);
    grunt.registerTask("tests", [ "typescript:tests", "mochaTest:tests" ]);
    grunt.registerTask("benchmarks", [ "typescript:benchmarks", "baseline:benchmarks" ]);

};