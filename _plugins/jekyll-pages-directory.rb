# Adopted plugin based on original concept https://github.com/bbakersmith/jekyll-pages-directory

module Jekyll
  class PagesDirGenerator < Generator

    def generate(site)
      lessons = Array.new
      lessons_map = Hash.new
      pages_dir = site.config['pages'] || './_pages'
      all_raw_paths = Dir["#{pages_dir}/**/*"]
      all_raw_paths.each do |f|

        if File.file?(File.join(site.source, '/', f))
          filename = f.match(/[^\/]*$/)[0]
          clean_filepath = f.gsub(/^#{pages_dir}\//, '')
          clean_dir = extract_directory(clean_filepath)
          final_dir = clean_dir.sub('/','')

          page = PagesDirPage.new(site,
                                  site.source,
                                  clean_dir,
                                  filename,
                                  pages_dir)

          # kursgo-only modification: populates lessons array based on the order of folder names appearance in lessons.yml file
          index = site.data["lessons"].index(final_dir)

          if /index/.match(filename)
              # hack - forcing default layout based on config (can't do it otherwise)
              page.data["layout"] = site.config["layout"]

              lessons[index] = page if not index.nil?
              lessons_map[final_dir] = page
          end

          site.pages << page

        end
      end

      rearrange lessons

      site.config['lessons'] = lessons
      site.config['lessons_map'] = lessons_map
    end

    # add next_lesson and prev_lesson extra fields to pages, can be used in html, e.g. {{ page.next_lesson }}
    def rearrange(lessons)
        last_lesson = nil
        lessons.each_with_index do |lesson, index|

            lesson.data['prev_lesson'] = last_lesson
            lesson.data['next_lesson'] = lessons[index + 1]
            last_lesson = lesson

        end
    end

    def extract_directory(filepath)
      dir_match = filepath.match(/(.*\/)[^\/]*$/)
      if dir_match
        return dir_match[1]
      else
        return ''
      end
    end

  end


  class PagesDirPage < Page

    def initialize(site, base, dir, name, pagesdir)
      @site = site
      @base = base
      @dir = dir
      @name = name

      process(name)

      read_yaml(File.join(base, pagesdir, dir), name)
    end

  end


end
