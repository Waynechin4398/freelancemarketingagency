/* Wayne Omni content portal: custom SEO widget and branded previews for Decap CMS. */
(function () {
  if (!window.CMS) return;
  var CMS = window.CMS;
  var h = window.h;
  var createClass = window.createClass;
  var BRAND = " — Wayne Omni";
  var SITE = "https://wayneomni.com";

  CMS.registerPreviewStyle("/admin/preview.css");

  function str(v) { return v == null ? "" : String(v); }
  function clip(text, max) { return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text; }
  function fullTitle(title) {
    if (!title) return "Wayne Omni — AI Agent Marketing Team, Malaysia";
    return title.indexOf("Wayne Omni") === 0 ? title : title + BRAND;
  }

  /* ---------- SEO text widget with a live length meter ---------- */
  var SeoControl = createClass({
    handleChange: function (e) { this.props.onChange(e.target.value); },
    render: function () {
      var field = this.props.field;
      var value = str(this.props.value);
      var multiline = field.get("multiline") === true;
      var min = field.get("min_length") || (multiline ? 120 : 30);
      var max = field.get("max_length") || (multiline ? 160 : 60);
      var suffix = field.get("brand_suffix") ? BRAND.length : 0;
      var len = value.length + (value && suffix ? suffix : 0);
      var state = !value ? "short" : len < min ? "short" : len > max ? "long" : "ok";
      var pct = Math.min(100, Math.round((len / max) * 100));
      var tip = !value
        ? "Empty: the page falls back to its normal title or intro."
        : state === "ok" ? "Good length."
        : state === "short" ? "A little short. Aim for " + min + "–" + max + " characters."
        : "Too long. Google will cut it off after about " + max + " characters.";
      var input = multiline
        ? h("textarea", { id: this.props.forID, rows: 3, value: value, onChange: this.handleChange, className: this.props.classNameWrapper })
        : h("input", { id: this.props.forID, type: "text", value: value, onChange: this.handleChange, className: this.props.classNameWrapper });
      return h("div", { className: "wo-seo" },
        input,
        h("div", { className: "wo-seo-meter" },
          h("div", { className: "wo-seo-bar wo-seo-" + state }, h("span", { style: { width: pct + "%" } })),
          h("span", null, len + " / " + max + (suffix && value ? " incl. “ — Wayne Omni”" : ""))
        ),
        h("div", { className: "wo-seo-tip" }, tip)
      );
    }
  });
  CMS.registerWidget("seo", SeoControl, function (props) { return h("span", null, str(props.value)); });

  /* ---------- Google result snippet ---------- */
  function serp(title, description, path) {
    return h("div", { className: "serp" },
      h("div", { className: "serp-site" },
        h("span", { className: "serp-icon" }, "◎"),
        h("div", null, h("div", { className: "serp-name" }, "Wayne Omni"), h("div", { className: "serp-url" }, SITE + path))
      ),
      h("div", { className: "serp-title" }, clip(fullTitle(title), 62)),
      h("div", { className: "serp-desc" }, clip(str(description), 160) || h("em", null, "No meta description yet."))
    );
  }

  function section(label, children) {
    return h("section", { className: "block" }, h("div", { className: "eyebrow" }, label), children);
  }

  /* ---------- Page SEO preview ---------- */
  var PAGES = [
    ["home", "Home", "/"], ["about", "About", "/about/"], ["aiAgents", "AI Agents", "/ai-agents/"],
    ["aiVisibility", "AI Visibility", "/ai-visibility/"], ["services", "Services", "/services/"],
    ["insights", "Insights", "/insights/"], ["work", "Work", "/work/"], ["contact", "Contact", "/contact/"]
  ];
  CMS.registerPreviewTemplate("pages", createClass({
    render: function () {
      var data = this.props.entry.get("data");
      return h("main", { className: "wrap" },
        h("h1", { className: "display" }, "How your pages look on Google"),
        PAGES.map(function (p) {
          var page = data.get(p[0]);
          return section(p[1], serp(page && page.get("title"), page && page.get("description"), p[2]));
        })
      );
    }
  }));

  /* ---------- Insight (article) preview ---------- */
  CMS.registerPreviewTemplate("insights", createClass({
    render: function () {
      var e = this.props.entry;
      var get = function (k) { return e.getIn(["data", k]); };
      var slug = e.get("slug") || "new-article";
      var date = str(get("updatedDate") || get("publishDate")).slice(0, 10);
      return h("main", { className: "wrap" },
        section("Google result", serp(get("seoTitle") || get("title"), get("seoDescription") || get("excerpt"), "/insights/" + slug + "/")),
        h("article", { className: "article" },
          h("div", { className: "pill" }, str(get("category")) || "Category"),
          get("draft") ? h("div", { className: "pill pill-warn" }, "Draft: hidden on the live site") : null,
          h("h1", { className: "display" }, str(get("title")) || "Untitled article"),
          h("p", { className: "lede" }, str(get("excerpt"))),
          h("p", { className: "byline" }, [str(get("authorName")) || "Wayne", date].filter(Boolean).join(" · ")),
          h("div", { className: "body" }, this.props.widgetFor("body"))
        )
      );
    }
  }));

  /* ---------- Service preview ---------- */
  CMS.registerPreviewTemplate("services", createClass({
    render: function () {
      var e = this.props.entry;
      var get = function (k) { return e.getIn(["data", k]); };
      var slug = e.get("slug") || "service";
      return h("main", { className: "wrap" },
        section("Google result", serp(get("seoTitle") || get("title"), get("seoDescription") || get("intro"), "/services/" + slug + "/")),
        h("article", { className: "article" },
          h("div", { className: "pill" }, [get("group"), get("number")].filter(Boolean).join(" · ")),
          get("draft") ? h("div", { className: "pill pill-warn" }, "Draft: hidden on the live site") : null,
          h("h1", { className: "display" }, str(get("title"))),
          h("p", { className: "lede" }, str(get("intro")))
        )
      );
    }
  }));

  /* ---------- SEO task preview ---------- */
  CMS.registerPreviewTemplate("seoTasks", createClass({
    render: function () {
      var e = this.props.entry;
      var get = function (k) { return e.getIn(["data", k]); };
      var status = str(get("status")) || "idea";
      return h("main", { className: "wrap" },
        h("article", { className: "task" },
          h("div", { className: "task-top" },
            h("span", { className: "pill status-" + status }, status.replace(/-/g, " ")),
            get("type") ? h("span", { className: "pill" }, str(get("type"))) : null,
            get("priority") ? h("span", { className: "pill" }, "Priority: " + get("priority")) : null,
            h("span", { className: "pill" }, "Owner: " + (str(get("owner")) || "Claude"))
          ),
          h("h1", { className: "display" }, str(get("title")) || "New SEO task"),
          get("target") ? h("p", { className: "byline" }, "Target: " + get("target")) : null,
          get("due") ? h("p", { className: "byline" }, "Due: " + str(get("due")).slice(0, 10)) : null,
          h("div", { className: "body" }, this.props.widgetFor("body")),
          get("result") ? section("Claude’s notes", h("p", null, str(get("result")))) : null,
          get("pr") ? section("Change waiting in Workflow", h("a", { href: get("pr"), target: "_blank" }, get("pr"))) : null
        )
      );
    }
  }));
})();
