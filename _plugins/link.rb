# coding: UTF-8
#
module Jekyll

  class LessonLinkTag < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render_link(url, anchor, cls = [])
        if cls.size > 0
            "<a href=\"#{url}\" class=\"#{cls.join(" ")}\">#{anchor}</a>"
        else
            "<a href=\"#{url}\">#{anchor}</a>"
        end
    end

    def render(context)
        markup = @markup.split " "
        name = markup[0]
        selector = markup.shift.split "."

        # check if lesson is served as a variable
        lesson = context
        while (selector.count > 0) do
            lesson = lesson[selector.shift]
        end

        # if lesson is still nil, find it by the name
        lesson = context.registers[:site].config["lessons_map"][name] if lesson.nil?

        current_lesson = context["page"]

        url = lesson["url"].sub("index.html", "")

        anchor = markup.join " "
        anchor = lesson["title"] if anchor.empty?

        cls = []
        cls << "active" if current_lesson["title"] == lesson["title"]

        render_link url, anchor, cls
    end
  end

  class LessonButtonTag < LessonLinkTag
      def render_link(url, anchor, cls)
          super(url, anchor, ["button"].concat(cls))
      end
  end
end

Liquid::Template.register_tag('lesson_link', Jekyll::LessonLinkTag)
Liquid::Template.register_tag('lesson_button', Jekyll::LessonButtonTag)