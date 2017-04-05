"use strict";

module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'js/jquery/*.js',
          'js/libs/*.js',
          'js/main.js'  // Конкретный файл
        ],
        dest: 'js/production.js'
      }
    },
    uglify: {
      build: {
        src: 'js/production.js',
        dest: 'build/js/production.min.js'
      }
    },
    sass: {
      style: {
        files: {
          "build/css/style.css": "sass/style.scss"
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require("autoprefixer")({browsers: [
                "last 2 versions"
              ]}),
            require("css-mqpacker")({
              sort: true
            })
          ]
        },
        src: "build/css/*.css"
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build/",
          watchTask: true,
          notify: false,
          open: true,
          cors: true,
          ui: false
        }
      }
    },
    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },
    imagemin: {
      images: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
            expand: true,
            src: ["build/img/**/*.{png,jpg,gif}"]
          }]
      }
    },
    svgstore: {
      options: {
        svg: {
          style: "display:none"
        }
      },
      symbols: {
        files: {
          "build/img/symbols.svg": ["img/icons/*.svg"]
        }
      }
    },
    svgmin: {
      symbols: {
        files: [{
            expand: true,
            src: ["build/img/icons/*.svg"]
          }]
      }
    },
    watch: {
      html: {
        files: ["*.html"],
        tasks: ["copy:html"]
      },
      style: {
        files: ["sass/**/*.{scss,sass}"],
        tasks: ["sass", "postcss", "csso"]
      }
    },
    copy: {
      build: {
        files: [{
            expand: true,
            src: [
              "fonts/**/*.{woff,woff2}",
              "img/**",
              "js/production.min.js",
              "*.html"
            ],
            dest: "build"
          }]
      },
      html: {
        files: [{
            expand: true,
            src: [
              "*.html"
            ],
            dest: "build"
          }]
      }
    },
    clean: {
      build: ["build"]
    }
  });

  grunt.registerTask("serve", ["browserSync", "watch"]);
  grunt.registerTask("symbols", ["svgmin", "svgstore"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "sass",
    "postcss",
    "csso",
    "symbols",
    "imagemin",
    "concat",
    "uglify"
  ]);
};
