# coding: UTF-8
#
module Jekyll

  class RenderProblemTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      site = context.registers[:site]
      path = File.join site.source, 'problemy-dla-50-kyu', @text
      return "<div>Sgf #{@text} not found.</div>" unless File.exists? path
      sgf = CGI::escapeHTML File.read(path)
      "<div class=\"problem\" data-sgf=\"#{sgf}\">Jeżeli chcesz rozwiązywać problemy interaktywnie, musisz włączyć JavaScript.</div>"
    end
  end
end

Liquid::Template.register_tag('problem', Jekyll::RenderProblemTag)
