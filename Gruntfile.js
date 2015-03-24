var path = require("path");
var fs = require("fs");

module.exports = function(grunt) {

    grunt.option('stack', true);

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-baseline");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-tsreflect");
    grunt.loadNpmTasks('grunt-ts-clean');
    grunt.loadNpmTasks('grunt-dts-concat');

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
            build: {
                options: {
                    references: [
                        "core",
                        "webworker"
                    ],
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    declaration: true,
                    noImplicitAny: true
                },
                src: ['src/**/*.ts'],
                dest: 'build/'
            },
            tests: {
                options: {
                    references: [
                        "core",
                        "webworker"
                    ],
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    noImplicitAny: true
                },
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/'
            },
            benchmarks: {
                options: {
                    references: [
                        "core",
                        "webworker"
                    ],
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    noImplicitAny: true
                },
                src: [
                    'benchmarks/**/*.ts'
                ],
                dest: 'build/'
            }
        },

        tsreflect: {
            build: {
                src: [
                    "src/**/*.ts"
                ],
                dest: "build/src/"
            },
            fixtures: {
                src: [
                    "tests/fixtures/**/*.ts"
                ],
                dest: "build/tests/fixtures/"
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
                            'service-model.d.ts'
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

        dts_concat: {
            lib: {
                options: {
                    name: 'service-model',
                    main: 'build/src/index.d.ts',
                    outDir: 'lib/'
                }
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
    grunt.registerTask("lib", [ "clean:lib", "copy:lib", "ts_clean:lib", "dts_concat:lib" ]);
    grunt.registerTask("tests", [ "typescript:tests", "tsreflect:fixtures", "mochaTest:tests" ]);
    grunt.registerTask("benchmarks", [ "typescript:benchmarks", "baseline:benchmarks" ]);

};