//配置任务代码
//基本格式wrapper函数，所有代码在这个函数里

module.exports = function(grunt){
  //里面写定义的任务
  grunt.initConfig({
    watch: {
        jade: {
          files: ['views/**'],//files：设置监听位置，监听改动
          options: {
            livereload: true//true：改动重启
          }
        },
        js: {
          files: ['public/javascripts/**', 'models/**/*.js', 'schemas/**/*.js'],
          //tasks: ['jshint'],//语法检查
          options: {
            livereload: true
          }
        }
    },
    nodemon: {
        dev: {//开发环境
          script: './bin/www',//当前入口文件
          options: {
            /*file: 'app.js',//files当前入口文件
            args: [],
            ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
            watchedExtensions: ['js'],
            watchedFolders: ['app', 'config'],
            debug: true,
            delayTime: 1,
            */
           
            args: [],
            nodeArgs: ['--inspect'],
            ignore: ['README.md', 'node_modules/**', '.DS_Store'],
            ext: '',
            watch: ['./'],
            delay: 1000,
           
           
            env: {
              PORT: 3000
            },
            cwd: __dirname
          }
        }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],//tasks：能跑nodemon和watch
      options: {
        logConcurrentOutput: true
      }
    }
  })

  //grunt.loadNpmTasks()加载任务插件
  grunt.loadNpmTasks('grunt-contrib-watch')//有文件修改就会重新执行在里面注册的任务
  grunt.loadNpmTasks('grunt-nodemon')//实时监听app.js，改动时会自动重启
  grunt.loadNpmTasks('grunt-concurrent')//针对慢任务，优化构建时间

  grunt.option('force', true)//语法等错误时不中断服务

  //grunt.registerTask()注册任务
  grunt.registerTask('default', ['concurrent'])
  //名为default，内容为grunt.initConfig里concurrent的任务
}