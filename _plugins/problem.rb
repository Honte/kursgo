# coding: UTF-8
#
module Jekyll

  class SgfBlock < Liquid::Block
    def initialize(tag_name, sgf, tokens)
      super
      @sgf = sgf.strip
    end

    def read_sgf(context)
      site = context.registers[:site]
      page = context.registers[:page]
      path = File.join site.source, site.config["pages"], page["dir"], @sgf
      path += ".sgf"

      return "Sgf #{@sgf} not found" unless File.exists? path

      CGI::escapeHTML File.open(path, "r:UTF-8", &:read)
    end
  end

  class ProblemBlock < SgfBlock
    def render(context)
      "<div class=\"sgf problem\" data-sgf=\"#{read_sgf(context)}\">
        <p>#{super}</p>
        <div class=\"board\">Jeżeli chcesz rozwiązywać problemy interaktywnie, musisz włączyć JavaScript.</div>
        <div class=\"status\">
            <p>Twój ruch.</p>
            <a class=\"button\">Jeszcze raz</a>
        </div>
      </div>"
    end
  end

  class DiagramBlock < SgfBlock
    def render(context)
      "<div class=\"sgf diagram\" data-sgf=\"#{read_sgf(context)}\">
        <div class=\"board\">Jeżeli chcesz przeglądać diagramy, musisz włączyć JavaScript.</div>
        <p>#{super}</p>
      </div>"
    end
  end
end

Liquid::Template.register_tag('problem', Jekyll::ProblemBlock)
Liquid::Template.register_tag('diagram', Jekyll::DiagramBlock)
