# coding: UTF-8
#
module Jekyll

  class LessonLinkTag < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render_link(url, cls, anchor)
        "<a href=\"#{url}\" class=\"#{cls}\">#{anchor}</a>"
    end

    def render(context)
        markup = @markup.split " "
        selector = markup.shift.split "."

        lesson = context
        while (selector.count > 0) do
            lesson = lesson[selector.shift]
        end

        current_lesson = context["page"]

        url = lesson["url"].sub("index.html", "")

        anchor = markup.join " "
        anchor = lesson["title"] if anchor.empty?

        cls = ""
        cls = cls + "active" if current_lesson["title"] == lesson["title"]

        render_link url, cls, anchor
    end
  end

  class LessonButtonTag < LessonLinkTag
      def render_link(url, cls, anchor)
          super(url, ["button", cls].join(" "), anchor)
      end
    end
end

Liquid::Template.register_tag('lesson_link', Jekyll::LessonLinkTag)
Liquid::Template.register_tag('lesson_button', Jekyll::LessonButtonTag)
