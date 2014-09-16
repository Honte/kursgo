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

    def template(sgf, params={})
      params[:status] ||= "Twój ruch."
      params[:reset] ||= "Jeszcze raz."
      params[:fallback] ||= "Jeżeli chcesz rozwiązywać problemy interaktywnie, musisz włączyć JavaScript."

      back = "<a class=\"back button\">#{params[:back]}</a>" if params[:back]
      reset = "<a class=\"reset button\">#{params[:reset]}</a>" unless params[:noreset]

      "<div class=\"sgf #{params[:cls]}\" data-sgf=\"#{sgf}\">
        <div class=\"description\">#{params[:description]}</div>
        <div class=\"board\">#{params[:fallback]}</div>
        <div class=\"status\">
          <p>#{params[:status]}</p>
          #{back}
          #{reset}
        </div>
      </div>"
    end
  end

  class ProblemBlock < SgfBlock
    def render(context)
      template(
        read_sgf(context),
        cls: "problem",
        description: super
      )
    end
  end

  class DiagramBlock < SgfBlock
    def render(context)
      "<div class=\"sgf diagram\" data-sgf=\"#{read_sgf(context)}\">
        <div class=\"board\">Jeżeli chcesz przeglądać diagramy, musisz włączyć JavaScript.</div>
        <div class=\"description\">#{super}</div>
      </div>"
    end
  end

  class ReviewBlock < SgfBlock
    def render(context)
      "<div class=\"sgf review\" data-sgf=\"#{read_sgf(context)}\">
        <div class=\"board\">Jeżeli chcesz przeglądać gry, musisz włączyć JavaScript.</div>
        <div class=\"description\">#{super}</div>
      </div>"
    end
  end

  class FreePlayBlock < SgfBlock
    def render(context)
      template(
        read_sgf(context),
        cls: "freeplay",
        description: super,
        reset: "Od początku",
        back: "Cofnij",
        status: "Ruch czarnego."
      )
    end
  end

  class BlackPlayBlock < SgfBlock
    def render(context)
      template(
        read_sgf(context),
        cls: "blackplay",
        description: super,
        reset: "Od początku"
      )
    end
  end
end

Liquid::Template.register_tag('problem', Jekyll::ProblemBlock)
Liquid::Template.register_tag('diagram', Jekyll::DiagramBlock)
Liquid::Template.register_tag('freeplay', Jekyll::FreePlayBlock)
Liquid::Template.register_tag('blackplay', Jekyll::BlackPlayBlock)
Liquid::Template.register_tag('review', Jekyll::ReviewBlock)