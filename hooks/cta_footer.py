"""
MkDocs hook to automatically inject CTA footer into blog posts.
"""

def on_page_markdown(markdown, page, config, files):
    """
    Inject CTA footer at the end of blog post pages.

    Hook is called during markdown processing phase, before HTML rendering.
    Detects blog posts by checking if page path contains 'writing/posts/'.
    """
    # Only inject CTA into blog post pages
    if 'writing/posts/' in page.file.src_path:
        # CTA markdown block matching testimonial pattern
        cta_markdown = """

---

<div class="cta-footer">
  <div class="cta-content">
    <h3>Need help with a project?</h3>
    <p>I help teams build intelligent systems using RAG, LLM agents, and modern AI architectures. Whether you're starting from scratch or optimizing existing systems, let's talk about what you're building.</p>
    <div class="cta-actions">
      <a href="mailto:nilmonfort98@gmail.com" class="cta-button cta-button-primary">Get in touch</a>
      <a href="https://www.hexalonai.com" class="cta-button cta-button-secondary" target="_blank" rel="noopener noreferrer">Visit Hexalon AI</a>
    </div>
  </div>
</div>
"""
        # Append CTA to markdown content
        return markdown + cta_markdown

    # Return unmodified markdown for non-blog pages
    return markdown
