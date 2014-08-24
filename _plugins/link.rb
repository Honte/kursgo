# coding: UTF-8
#
module Jekyll

  class LessonLinkTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @variable = text.strip
    end

    def render(context)
        selector = @variable.split "."

        lesson = context
        while (selector.count > 0) do
            lesson = lesson[selector.shift]
        end

        current_lesson = context["page"]

        url = lesson["url"].sub("index.html", "")
        cls = ""

        if current_lesson["title"] == lesson["title"]
            cls = " class=\"active\""
        end

        "<a href=\"#{url}\"#{cls}>#{lesson["title"]}</a>"
    end
  end
end

Liquid::Template.register_tag('lesson_link', Jekyll::LessonLinkTag)
