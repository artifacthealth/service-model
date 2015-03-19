module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-baseline");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-tsreflect");

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
                    target: "es5",
                    module: "commonjs",
                    sourceMap: true,
                    declaration: false,
                    noImplicitAny: true
                },
                src: ['src/**/*.ts'],
                dest: 'build/'
            },
            tests: {
                options: {
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
                    }
                ]
            },
            lib: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/src/',
                        src: [
                            '**/*.js'
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
        }
    });

    // Default task(s).
    grunt.registerTask("default", [ "build", "tests" ]);
    grunt.registerTask("build", [ "clean:build", "typescript:build", "copy:build", "typescript:benchmarks" ]);
    grunt.registerTask("lib", [ "clean:lib",  "copy:lib" ]);
    grunt.registerTask("tests", [ "typescript:tests", "tsreflect:fixtures", "mochaTest:tests" ]);
    grunt.registerTask("benchmarks", [ "typescript:benchmarks", "baseline:benchmarks" ]);

};